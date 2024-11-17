import { BaseStreamer, PreTrainedTokenizer } from "@huggingface/transformers";
import { createStreamableValue } from "ai/rsc";

export class Streamer extends BaseStreamer {
    tokenizer: PreTrainedTokenizer;
    skip_prompt: boolean;
    next_tokens_are_prompt: boolean;
    stream: ReturnType<typeof createStringStreamableValue>;

    constructor(
        tokenizer: PreTrainedTokenizer,
        skip_prompt: boolean = true,
        stream: ReturnType<typeof createStringStreamableValue>
    ) {
        super();
        this.tokenizer = tokenizer;
        this.skip_prompt = skip_prompt;
        this.next_tokens_are_prompt = true;
        this.stream = stream;
    }
    
    put(value: bigint[][]) {
        if(value.length > 1) {
            throw Error("Streamer only supports batch size of 1");
        }
        if(this.skip_prompt && this.next_tokens_are_prompt) {
            this.next_tokens_are_prompt = false;
            return;
        }
        const token = value[0];
        const text = this.tokenizer.decode(token, { skip_special_tokens: true });
        this.stream.update(text);
    }
    
    end() {
        this.stream.done();
    }
}

// Why does Next.JS not make the StreamableValueWrapper type available? Nobody knows!
function createStringStreamableValue() {
    return createStreamableValue("");
}