import gc
from typing import cast, List
import torch
from transformers import pipeline, TextIteratorStreamer, AutoTokenizer, TextGenerationPipeline

loaded_model_id: str | None
pipe: TextGenerationPipeline

def load_model(model_id: str) -> TextIteratorStreamer:
    global loaded_model_id
    loaded_model_id = model_id
    streamer = TextIteratorStreamer(
        cast(AutoTokenizer, AutoTokenizer.from_pretrained(model_id)),
        skip_prompt=True,
        timeout=None,
        skip_special_tokens=True
    )
    global pipe
    pipe = cast(TextGenerationPipeline,
        pipeline(
            "text-generation",
            model=model_id,
            streamer=streamer,
            torch_dtype=torch.bfloat16, # TODO: Accept other dtypes
            device_map="auto" # TODO: Is there a need to change this?
        ))
    return streamer

def unload_model():
    global loaded_model_id
    loaded_model_id = None
    global pipe
    del pipe
    gc.collect()
    torch.cuda.empty_cache()

def generate_and_cleanup(raw_messages: List[str]) -> None:
    messages = []
    for i, raw_message in enumerate(raw_messages):
        messages.append({
            "role": "user" if i % 2 == 0 else "assistant",
            "content": raw_message
        })
    global loaded_model_id
    if(loaded_model_id == None):
        raise Exception("Error: Calling generate() but no model is loaded.")
    global pipe
    pipe(messages, max_new_tokens=1000) # TODO: Let user modify max_new_tokens