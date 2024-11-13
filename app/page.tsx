"use client"
import Sidebar from "./Sidebar";
import { useState } from "react";

function generateId() {
    const characters = "0123456789abcdef";
    let string = "";
    for(let i = 0; i < 16; i++) {
        string += characters[Math.floor(Math.random() * 16)];
    }
    return string;
}

export type Conversation = {
    id: string,
    title: string,
    messages: string[],
    model: string
}

export default function Page() {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: "9e027eae43cfb26a",
            title: "New conversation",
            messages: [
                "I am asking you a question, LLM. Please answer my question.",
                "Sure, here is your answer: asdfkakbkakbkakb",
                "Thank you for your answer.",
                "No problem"
            ],
            model: "nvidia/Llama3-ChatQA-2-8B"
        },
        {
            id: "29db46cb8ff79bf0",
            title: "Python String Help",
            messages: [
                "Please generate a function which will count the number of characters in a string",
                "Here is the function you requested:\ndef countCharacters(string, character):\n\treturn 5"
            ],
            model: "nvidia/Llama3-ChatQA-2-8B"
        }
    ]);
    const [ activeConversation, setActiveConversation ] = useState<Conversation | null>(null);
    
    return <main className="w-full h-screen flex">
        <Sidebar conversations={conversations} activeConversation={activeConversation} setActiveConversation={setActiveConversation}  />
    </main>
}
