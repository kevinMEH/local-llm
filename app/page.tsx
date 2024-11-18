"use client"

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { getAllConversations } from "./api/conversations";
import type { Conversation } from "./api/database";

export default function Page() {
    const [ activeConversationId, setActiveConversationId ] = useState<string | null>(null);
    const [ conversations, setConversations ] = useState<Conversation[]>([]);
    
    async function refreshConversations() {
        setConversations(await getAllConversations());
    }
    
    useEffect(() => {
        (async () => {
            refreshConversations();
        })();
    }, []);
    
    return <main className="w-full h-screen flex">
        <Sidebar conversations={conversations} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId}  />
        <Chat
            conversations={conversations}
            refreshConversations={refreshConversations}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
        />
    </main>
}
