from typing import cast
import torch
from transformers import pipeline, TextGenerationPipeline, TextStreamer, AutoTokenizer

model_id = "meta-llama/Llama-3.2-3B-Instruct"
streamer = TextStreamer(tokenizer=cast(AutoTokenizer, AutoTokenizer.from_pretrained(
    model_id)))

messages = [
    {'role': 'user', 'content': 'Create a function that makes a pyramid N tall out of 7s.'},
]
pipe: TextGenerationPipeline = cast(TextGenerationPipeline, pipeline(
    "text-generation", model=model_id, streamer=streamer, torch_dtype=torch.bfloat16, device_map="auto"))
full = pipe(messages, max_new_tokens=1000, return_full_text=True)
print(full)
