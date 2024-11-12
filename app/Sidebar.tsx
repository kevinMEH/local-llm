import Link from "next/link";
import BookIcon from "@/design/icons/BookIcon";
import GithubIcon from "@/design/icons/GithubIcon";
import PlusIcon from "@/design/icons/PlusIcon";
import SettingsIcon from "@/design/icons/SettingsIcon";

type Chat = {
    title: string,
    conversation: string[],
    model: string,
    selected: boolean
}

const chats: Chat[] = [
    {
        title: "New conversation",
        conversation: [],
        model: "nvidia/Llama3-ChatQA-2-8B",
        selected: true
    },
    {
        title: "Python String Help",
        conversation: [],
        model: "nvidia/Llama3-ChatQA-2-8B",
        selected: false
    }
]

export default function Sidebar({}) {
    return <div className="max-w-60 basis-1/5 min-w-64 bg-bg-light flex flex-col p-3 gap-4 border-r border-highlight">
        <button className="px-4 py-3.5 rounded-md border-highlight border flex gap-2 items-center">
            <PlusIcon width={20} height={20} />
            <p className="text-sm">New conversation</p>
        </button>
        <h2 className="ml-3 text-xs font-bold text-sub mt-1">CHAT HISTORY</h2>
        <div className="flex flex-1 flex-col gap-1 text-sm whitespace-nowrap">
            { chats.map((chat, i) => <button
                key={i}
                className={`px-5 py-4 ${chat.selected && "bg-bg-dark"} rounded-md flex gap-3 items-center`}
            >
                <BookIcon width={18} height={18} className="flex-shrink-0" />
                <p className="w-auto overflow-ellipsis overflow-hidden">{chat.title}</p>
            </button>)}
        </div>
        <div className="border-t border-highlight mx-1" />
        <div className="px-3 pt-2 pb-3 flex flex-col gap-6 tracking-wide text-sm">
            <Link className="flex items-center gap-[1.125rem]" href={"https://github.com/kevinMEH/local-llm"} target="_blank">
                <GithubIcon width={20} height={20} />
                <p>Github</p>
            </Link>
            <button className="flex items-center gap-[1.125rem]">
                <SettingsIcon width={20} height={20} />
                <p>Settings</p>
            </button>
        </div>
    </div>
}