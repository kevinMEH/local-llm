"use client"
import { useRef } from "react";
import type Quill from "quill";
import SendIcon from "@/design/icons/SendIcon";
import dynamic from "next/dynamic";
import { Conversation } from "./page";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

type ChatParameters = {
    conversation: Conversation | null
}

export default function Chat({ conversation }: ChatParameters) {
    const quillRef = useRef(null as null | Quill);
    
    return <div className="w-full h-full flex-1 overflow-auto flex flex-col justify-between items-center gap-8">
        <div className="w-full h-full mt-12 overflow-auto" style={{ scrollbarGutter: "stable" }}>
            <Recenterer
                flexClassName="pl-12 pr-8 pb-18 pt-8"
                mainThreshold="max-w-[1800px]"
                recentererThreshold="max-w-40"
            >
                <div className="flex flex-col gap-6 w-full max-w-3xl pb-12 whitespace-pre-wrap break-words">
                    { conversation === null
                        ? <div>Nothing here</div>
                        : conversation.messages.map((message, i) => {
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
        <div className="w-full m-auto">
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
    return <div className={`w-full flex justify-between ${flexClassName}`}>
        <div />
        <div className={`w-full flex justify-around ${mainThreshold}`}>
            {children}
        </div>
        <div className={`flex-grow flex-shrink ${recentererThreshold}`} />
    </div>
}