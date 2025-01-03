import type { Dispatch } from "react";
import Link from "next/link";
import CodeIcon from "@/design/icons/CodeIcon";
import PlusIcon from "@/design/icons/PlusIcon";
import SettingsIcon from "@/design/icons/SettingsIcon";
import ChatBubbleIcon from "@/design/icons/ChatBubbleIcon";
import type { BackendConversation } from "./api/database";

type SidebarParameters = {
    conversations: BackendConversation[],
    activeConversationId: string | null,
    setActiveConversationId: Dispatch<string | null>
}

export default function Sidebar({ conversations, activeConversationId, setActiveConversationId }: SidebarParameters) {
    return <div className="min-w-64 basis-1/5 bg-bg-light flex flex-col p-3 gap-2 border-r border-highlight">
        <button
            onClick={() => setActiveConversationId(null)}
            className={`px-4 py-3.5 bg-bg-light hover:bg-bg-mid rounded-md border-highlight border flex gap-2 items-center transition-colors`}
        >
            <PlusIcon size={20} />
            <p className="text-sm">New conversation</p>
        </button>
        <h2 className="ml-6 text-xs font-bold text-sub mt-4">CHAT HISTORY</h2>
        <div className="flex flex-1 flex-col gap-1 text-sm whitespace-nowrap">
            { conversations.map((conversation, i) => (
            <button
                key={i}
                className={`px-5 py-4 ${conversation.id == activeConversationId ? "bg-bg-dark" : "bg-bg-light hover:bg-bg-mid"} rounded-md flex gap-3 items-center transition-colors`}
                onClick={() => setActiveConversationId(conversation.id)}
            >
                <ChatBubbleIcon size={18} className="flex-shrink-0" />
                <p className="w-auto overflow-ellipsis overflow-hidden">{conversation.title}</p>
            </button>)) }
        </div>
        <div className="border-t border-highlight mx-1 my-2" />
        <div className="px-3 pt-2 pb-3 flex flex-col gap-6 tracking-wide text-sm">
            <Link className="flex items-center gap-[1.125rem]" href={"https://github.com/kevinMEH/local-llm"} target="_blank">
                <CodeIcon size={20} />
                <p>Github</p>
            </Link>
            <button className="flex items-center gap-[1.125rem]">
                <SettingsIcon size={20} />
                <p>Settings</p>
            </button>
        </div>
    </div>
}