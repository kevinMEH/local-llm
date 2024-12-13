export function randomId(length: number) {
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

export type Conversation = {
    id: string,
    title: string,
    model_id: string,
    messages: string[]
}

declare global {
    // eslint-disable-next-line no-var
    var database: Map<string, Conversation>;
}

// eslint-disable-next-line no-var
export var database: Map<string, Conversation>;

if(process.env.NODE_ENV !== "production") {
    if(!global.database) {
        global.database = new Map<string, Conversation>();
    }
    database = global.database;
} else {
    database = new Map<string, Conversation>();
}

export function getConversation(id: string): Conversation | undefined {
    return database.get(id);
}