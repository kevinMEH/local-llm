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

if(process.env.NODE_ENV !== "production") {
    if(!global.database) {
        global.database = new Map<string, Conversation>();
        let id;
        id = randomId(16);
        global.database.set(id, {
            id,
            title: "First",
            model_id: "meta-llama/Llama-3.2-3B-Instruct",
            messages: []
        });
        id = randomId(16);
        global.database.set(id, {
            id,
            title: "Second",
            model_id: "meta-llama/Llama-3.2-3B-Instruct",
            messages: []
        });
        id = randomId(16);
        global.database.set(id, {
            id,
            title: "Third",
            model_id: "meta-llama/Llama-3.2-3B-Instruct",
            messages: []
        });
    }
    database = global.database;
} else {
    database = global.database;
}

export function getConversation(id: string): Conversation | undefined {
    return database.get(id);
}