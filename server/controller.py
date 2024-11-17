# Accepts commands and dispatches to models
from multiprocessing import Process, Queue as MultiQueue
from threading import Thread
from typing import Tuple
from models.text_generation_pipeline import get_streamer, generate
from Command import Command

def generate_to_queue(global_streaming_queue: "MultiQueue[Tuple[str, str | None]]", command: Command):
    id = command["id"]
    model_id = command["model_id"]
    messages = command["messages"]
    streamer = get_streamer(model_id)
    thread = Thread(target=generate, args=(streamer, model_id, messages))
    thread.start()
    for delta in streamer:
        global_streaming_queue.put((id, delta))
    global_streaming_queue.put((id, None))
    thread.join()

def start_commands_processor(
    command_queue: "MultiQueue[Command]",
    global_streaming_queue: "MultiQueue[Tuple[str, str | None]]"
):
    while True:
        command = command_queue.get(True, None)
        instruction = command["instruction"]
        if(instruction == "completion"):
            generation = Process(target=generate_to_queue, args=(global_streaming_queue, command))
            generation.start()
            generation.join()