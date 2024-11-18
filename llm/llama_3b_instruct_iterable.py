from typing import cast
import torch
from transformers import pipeline, TextGenerationPipeline, AutoTokenizer, TextIteratorStreamer

model_id = "meta-llama/Llama-3.2-3B-Instruct"
streamer = TextIteratorStreamer(tokenizer=cast(AutoTokenizer, AutoTokenizer.from_pretrained(model_id)), skip_prompt=True, skip_special_tokens=True)

messages = [
    {
        "role": "user",
        "content": "Who was Oppenheimer and what happened to him?"
    },
]
pipe: TextGenerationPipeline = cast(TextGenerationPipeline, pipeline("text-generation", model=model_id, streamer=streamer, torch_dtype=torch.bfloat16, device_map="auto"))
pipe(messages, max_new_tokens=1000)

for delta in streamer:
    print(f"\"{delta}\"")