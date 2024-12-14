"use server";

import { createStreamableValue } from "ai/rsc";

export async function completions(model: string, messages: string[]) {
    const stream = createStreamableValue("");
    
    (async () => {
        const response = await fetch("http://127.0.0.1:2778/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                messages: messages
            }),
        });
        if(response.status !== 200 || response.body === null) {
            console.error("Error: Completion failed for some unknown reason.");
            stream.error("Error: Completion failed for some unknown reason.");
            return;
        }
        const decoder = new TextDecoder();
        for await(const data of (response.body as unknown as AsyncIterable<Uint8Array>)) {
            const parts = decoder.decode(data).trim().split("\n");
            if(parts[0] == "event: delta") {
                const value = JSON.parse(parts[1].substring(6)).v as string;
                stream.update(value);
            }
        }
        stream.done();
    })();

    return { output: stream.value };
}