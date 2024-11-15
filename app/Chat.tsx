"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import type Quill from "quill";
import dynamic from "next/dynamic";
import { Conversation } from "./page";
import SendIcon from "@/design/icons/SendIcon";
import ChevronDownIcon from "@/design/icons/ChevronDownIcon";
import EditIcon from "@/design/icons/EditIcon";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

type ChatParameters = {
    activeConversation: Conversation | null
}

export default function Chat({ activeConversation }: ChatParameters) {
    const quillRef = useRef(null as null | Quill);
    const [ title, setTitle ] = useState(activeConversation?.title || "");
    const [ model, setModel ] = useState("nvidia/Llama3-ChatQA-2-8B");
    
    useEffect(() => {
        setTitle(activeConversation?.title || "");
    }, [ activeConversation ]);
    
    function changeTitle(event: ChangeEvent<HTMLInputElement>) {
        if(activeConversation) {
            // TODO: Send change title request
            // Also update sidebar
            activeConversation.title = event.target.value;
        }
        setTitle(event.target.value);
    }
    
    return <div className="w-full h-full flex-1 overflow-auto flex flex-col justify-between items-center">
        <div className="w-full">
            <Recenterer
                flexClassName="pt-8 px-10"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className="flex items-center justify-between w-full max-w-3xl">
                    <div className="flex items-center gap-3 text-sub">
                        <EditIcon width={15} height={15} className={title === "" ? "text-sub" : "text-quiet"} />
                        <input
                            className="w-full bg-transparent placeholder-quiet flex-1 outline-none font-medium py-1.5"
                            value={title}
                            onChange={changeTitle}
                            placeholder="Conversation title"
                        />
                    </div>
                    <button className="flex items-center gap-2 pl-5 pr-[1.125rem] py-3 rounded-md text-nowrap hover:bg-bg-light">
                        <p>{ model }</p>
                        <ChevronDownIcon width={18} height={18} />
                    </button>
                </div>
            </Recenterer>
        </div>
        <div className="w-full h-full overflow-auto mb-8" style={{ scrollbarGutter: "stable" }}>
            <Recenterer
                flexClassName="pl-12 pr-8 pb-18 pt-8"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className="flex flex-col gap-6 w-full max-w-3xl pb-12 whitespace-pre-wrap break-words">
                    { activeConversation === null
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
                            } else { // Assitant message
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
                <div className="flex w-full items-end max-w-3xl bg-bg-light border border-highlight rounded-md px-2 py-2 outline-none text-sub">
                    <div className="flex-1 min-w-0 flex flex-col">
                        <Editor
                            className="mx-4 my-2 outline-none max-h-[168px] invert-scrollbar-color overflow-auto"
                            ref={quillRef}
                        />
                    </div>
                    <button className="p-2 mx-2">
                        <SendIcon width={24} height={24} />
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
    return <div className={`w-full h-full flex justify-between ${flexClassName}`}>
        <div />
        <div className={`w-full h-full flex justify-around ${mainThreshold}`}>
            {children}
        </div>
        <div className={`flex-grow flex-shrink ${recentererThreshold}`} />
    </div>
}