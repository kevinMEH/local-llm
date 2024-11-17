from typing import cast, List
import torch
from transformers import pipeline, TextIteratorStreamer, AutoTokenizer, TextGenerationPipeline

def get_streamer(model_id: str) -> TextIteratorStreamer:
    return TextIteratorStreamer(
        cast(AutoTokenizer, AutoTokenizer.from_pretrained(model_id)),
        skip_prompt=True,
        timeout=None,
        skip_special_tokens=True
    )

def generate(streamer: TextIteratorStreamer, model_id: str, raw_messages: List[str]) -> None:
    messages = []
    for i, raw_message in enumerate(raw_messages):
        messages.append({
            "role": "user" if i % 2 == 0 else "assistant",
            "content": raw_message
        })
    pipe: TextGenerationPipeline = cast(TextGenerationPipeline,
        pipeline(
            "text-generation",
            model=model_id,
            streamer=streamer,
            torch_dtype=torch.bfloat16,
            device_map="auto"
        ))
    pipe(messages, max_new_tokens=1000)