"use client"

import { useEffect, useReducer, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { getAllConversations } from "./api/conversations";
import type { BackendConversation } from "./api/database";

export type FrontendConversation = BackendConversation & { generating?: boolean };

export type ReduceAction = {
    type: "Update",
    conversations: BackendConversation[]
} | {
    type: "New Conversation",
    conversation: BackendConversation
} | {
    type: "Change Title",
    id: string,
    title: string
} | {
    type: "Add Message",
    id: string,
    message: string
} | {
    type: "Start Generation",
    id: string
} | {
    type: "Stop Generation",
    id: string
} | {
    type: "Delta",
    id: string,
    delta: string
};

function changeOnlyTarget(
    conversations: FrontendConversation[],
    targetId: string,
    action: (target: FrontendConversation) => FrontendConversation
): FrontendConversation[] {
    return conversations.map(conversation => {
        if(conversation.id === targetId) {
            return action(conversation);
        } else {
            return conversation;
        }
    });
}

function reduceConversations(
    conversations: FrontendConversation[],
    action: ReduceAction
): FrontendConversation[] {
    switch(action.type) {
        case "Update": {
            return action.conversations;
        }
        case "New Conversation": {
            return [ ...conversations, action.conversation ];
        }
        case "Change Title": {
            return changeOnlyTarget(conversations, action.id, conversation => {
                return {
                    ...conversation,
                    title: action.title
                };
            });
        }
        case "Add Message": {
            return changeOnlyTarget(conversations, action.id, conversation => {
                return {
                    ...conversation,
                    messages: [...conversation.messages, action.message]
                };
            });
        }
        case "Delta": {
            return changeOnlyTarget(conversations, action.id, conversation => {
                const newConversation = {
                    ...conversation,
                    messages: [...conversation.messages]
                }
                newConversation.messages[conversation.messages.length - 1] += action.delta;
                return newConversation;
            });
        }
        case "Start Generation": {
            return changeOnlyTarget(conversations, action.id, conversation => {
                return {
                    ...conversation,
                    generating: true
                };
            });
        }
        case "Stop Generation": {
            return changeOnlyTarget(conversations, action.id, conversation => {
                return {
                    ...conversation,
                    generating: false
                };
            });
        }
        default: {
            throw new Error("Unknown action encountered.\n" + JSON.stringify(action));
        }
    }
}

export default function Page() {
    const [ activeConversationId, setActiveConversationId ] = useState<string | null>(null);
    const [ conversations, dispatchConversations ] = useReducer(reduceConversations, []);
    
    useEffect(() => {
        (async () => {
            dispatchConversations({
                type: "Update",
                conversations: await getAllConversations()
            });
        })();
    }, []);
    
    const activeConversation = conversations.find(conversation => {
        if(conversation.id === activeConversationId) {
            return true;
        }
    });
    
    return <main className="w-full h-screen flex">
        <Sidebar conversations={conversations} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId}  />
        <Chat
            activeConversation={activeConversation}
            dispatchConversations={dispatchConversations}
            setActiveConversationId={setActiveConversationId}
        />
    </main>
}
