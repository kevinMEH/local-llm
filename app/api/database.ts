type Conversation = {
    id: string,
    title: string,
    model_id: string,
    messages: string[]
}

function randomId(length: number) {
    const characters = "0123456789ABCDEF";
    let result = ""
    for(let i = 0; i < length; i++) {
        if(i % 4 == 0 && i != 0) {
            result += "-"
        }
        result += characters[Math.floor(Math.random() * 16)];
    }
    return result;
}

declare global {
    var database: Map<string, Conversation>;
}

if(process.env.NODE_ENV !== "production") {
    if(!global.database) {
        global.database = new Map<string, Conversation>();
    }
    database = global.database;
} else {
    database = global.database;
}

export function addConversation(title: string, model_id: string): Conversation {
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

export function getConversation(id: string): Conversation | undefined {
    return database.get(id);
}

export function getAllConversations(): Conversation[] {
    return [...database.values()];
}