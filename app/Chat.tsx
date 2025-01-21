import { ChangeEvent, Dispatch, useCallback, useEffect, useRef, useState } from "react";
import type Quill from "quill";
import dynamic from "next/dynamic";
import { readStreamableValue } from "ai/rsc";

import SendIcon from "@/design/icons/SendIcon";
import ChevronDownIcon from "@/design/icons/ChevronDownIcon";
import BrushIcon from "@/design/icons/BrushIcon";
import { addMessage, changeTitle, createConversation } from "./api/conversations";
import { completions } from "./api/completions";
import type { FrontendConversation, ReduceAction } from "./page.jsx";
import type { BackendConversation } from "./api/database.js";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

type ChatParameters = {
    activeConversation: FrontendConversation | undefined,
    dispatchConversations: Dispatch<ReduceAction>,
    setActiveConversationId: Dispatch<string | null>
}

const defaultModel = "meta-llama/Llama-3.2-1B-Instruct";

export default function Chat({ activeConversation, dispatchConversations, setActiveConversationId }: ChatParameters) {
    const quillRef = useRef(null as null | Quill);
    const [ title, setTitle ] = useState(activeConversation?.title || "");
    const [ model, setModel ] = useState(activeConversation?.model_id || defaultModel);
    
    async function changeTitleHandler(event: ChangeEvent<HTMLInputElement>) {
        const newTitle = event.target.value;
        if(activeConversation) {
            activeConversation.title = newTitle;
            await changeTitle(activeConversation.id, newTitle);
            dispatchConversations({
                type: "Change Title",
                id: activeConversation.id,
                title: newTitle
            });
        } else {
            setTitle(newTitle);
        }
    }
    
    useEffect(() => {
        setTitle(activeConversation?.title || "");
        setModel(activeConversation?.model_id || defaultModel)
    }, [activeConversation?.title, activeConversation?.model_id]);
    
    const onSubmit = useCallback(async () => {
        if(activeConversation?.generating) {
            return;
        }
        const message = quillRef.current?.getText().trim();
        if(message === undefined) {
            console.error("Error: Attempting to send undefined as message.");
            return;
        }
        quillRef.current?.setText("");
        let currentConversation: BackendConversation;
        if(!activeConversation) {
            currentConversation = await createConversation(title, model);
            dispatchConversations({
                type: "New Conversation",
                conversation: currentConversation
            });
            setActiveConversationId(currentConversation.id);
        } else {
            currentConversation = activeConversation;
        }
        await addMessage(currentConversation.id, message);
        dispatchConversations({
            type: "Add Message",
            id: currentConversation.id,
            message: message
        });
        const output = (await completions(model, [...currentConversation.messages, message])).output;
        dispatchConversations({
            type: "Start Generation",
            id: currentConversation.id
        });
        dispatchConversations({
            type: "Add Message",
            id: currentConversation.id,
            message: ""
        });
        const element = scrollContainerRef.current;
        if(element) {
            element.scrollTop = element.scrollHeight;
        }
        let assistantMessage = "";
        for await (const delta of readStreamableValue(output)) {
            if(delta) {
                assistantMessage += delta;
                dispatchConversations({
                    type: "Delta",
                    id: currentConversation.id,
                    delta: delta
                });
            }
        }
        await addMessage(currentConversation.id, assistantMessage);
        dispatchConversations({
            type: "Stop Generation",
            id: currentConversation.id
        });
    }, [activeConversation, dispatchConversations, model, title, setActiveConversationId]);
    
    const onSubmitRef = useRef(onSubmit);
    useEffect(() => {
        onSubmitRef.current = onSubmit;
    }, [onSubmit]);
    
    const scrollContainerRef = useRef(null as null | HTMLDivElement);
    useEffect(() => {
        const element = scrollContainerRef.current;
        if(element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [activeConversation])
    
    return <div className="w-full h-full flex-1 overflow-auto flex flex-col justify-between items-center">
        <div className="w-full">
            <Recenterer
                flexClassName="pt-8 px-10"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className="flex items-center justify-between w-full max-w-3xl">
                    <div className="flex items-center gap-3 text-sub">
                        <BrushIcon size={15} className={title === "" ? "text-sub" : "text-quiet"} />
                        <input
                            className="w-full bg-transparent placeholder-quiet flex-1 outline-none font-medium py-1.5"
                            value={title}
                            onChange={changeTitleHandler}
                            placeholder="Conversation title"
                        />
                    </div>
                    <button className="flex items-center gap-2 pl-5 pr-[1.125rem] py-3 rounded-md text-nowrap font-mono tracking-tight hover:bg-bg-light">
                        <p>{ model }</p>
                        <ChevronDownIcon size={18} />
                    </button>
                </div>
            </Recenterer>
        </div>
        <div
            className="w-full h-full overflow-auto"
            style={{ scrollbarGutter: "stable" }}
            ref={scrollContainerRef}
        >
            <Recenterer
                flexClassName="pl-12 pr-8 pt-8"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className="flex flex-col gap-6 w-full max-w-[46rem] mb-36 whitespace-pre-wrap break-words">
                    { activeConversation === undefined
                        ? <div className="h-full flex flex-col items-center justify-center text-sub">
                            <h2 className="text-4xl font-bold pb-3">Local LLM</h2>
                            <h3 className="font-medium">What would you like to know?</h3>
                        </div>
                        : activeConversation.messages.map((message, i) => {
                            if(i % 2 == 0) { // User message
                                return <div
                                    className="justify-self-end text-sub pl-12 text-end"
                                    key={i}
                                >
                                    <h4 className="font-bold text-xs mb-1">USER</h4>
                                    <p>{message}</p>
                                </div>
                            } else { // Assistant message
                                return <div
                                    className="justify-self-start text-main pr-12 text-start"
                                    key={i}
                                >
                                    <h4 className="font-bold text-xs mb-1">ASSISTANT</h4>
                                    <p>{message}</p>
                                </div>
                            }
                        })
                    }
                </div>
            </Recenterer>
        </div>
        <div className="w-full">
            <Recenterer
                flexClassName="pb-10 px-10"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className={`flex w-full items-end max-w-3xl bg-bg-light border border-highlight rounded-md px-2 py-2 outline-none ${activeConversation?.generating ? "text-quiet" : "text-sub"}`}>
                    <div className="flex-1 min-w-0 flex flex-col">
                        <Editor
                            className="mx-4 my-2 outline-none max-h-[168px] invert-scrollbar-color overflow-auto"
                            ref={quillRef}
                            onSubmitRef={onSubmitRef}
                        />
                    </div>
                    <button className={`p-2 mx-2 ${activeConversation?.generating ? "text-quiet" : ""}`} onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        onSubmit();
                    }}>
                        <SendIcon size={24} />
                    </button>
                </div>
            </Recenterer>
        </div>
    </div>
}

type RecentererParameters = {
    children: React.ReactNode,
    flexClassName: string,
    mainThreshold: string,
    recentererThreshold: string
}
function Recenterer({ children, flexClassName, mainThreshold, recentererThreshold }: RecentererParameters) {
    return <div className={`w-full min-h-full flex justify-between ${flexClassName}`}>
        <div />
        <div className={`w-full min-h-full flex justify-around ${mainThreshold}`}>
            {children}
        </div>
        <div className={`flex-grow flex-shrink ${recentererThreshold}`} />
    </div>
}