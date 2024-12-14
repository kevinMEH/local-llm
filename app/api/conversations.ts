"use server";

import { BackendConversation, randomId, database } from "./database";

export async function createConversation(title: string, model_id: string): Promise<BackendConversation> {
    let id = randomId(16);
    while(database.has(id)) {
        id = randomId(16);
    }
    const conversation: BackendConversation = {
        id, title, model_id,
        messages: []
    };
    database.set(id, conversation);
    return conversation;
}

export async function getAllConversations(): Promise<BackendConversation[]> {
    return [...database.values()];
}

export async function changeTitle(id: string, newTitle: string) {
    const conversation = database.get(id);
    if(conversation !== undefined) {
        conversation.title = newTitle;
    }
}

export async function addMessage(id: string, message: string) {
    const conversation = database.get(id);
    if(conversation !== undefined) {
        conversation.messages.push(message);
    } else {
    }
}