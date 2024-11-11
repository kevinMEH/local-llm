import torch
from transformers import pipeline

messages = [
    {"role": "user", "content": "Who are you?"},
]
pipe = pipeline("text-generation", model="meta-llama/Llama-2-7b-chat-hf", torch_dtype=torch.bfloat16, device="cuda")
print(pipe(messages))