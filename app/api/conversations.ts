"use server";

import { Conversation, randomId } from "./database";

export async function createConversation(title: string, model_id: string): Promise<Conversation> {
    let id = randomId(16);
    while(database.has(id)) {
        id = randomId(16);
    }
    const conversation: Conversation = {
        id, title, model_id,
        messages: []
    };
    database.set(id, conversation);
    return conversation;
}

export async function getAllConversations(): Promise<Conversation[]> {
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
        console.log("ADDED MESSAGE: " + message);
    } else {
        console.log("COULD NOT ADD MESSAGE: " + message);
    }
}