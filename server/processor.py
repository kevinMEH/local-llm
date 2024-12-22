# Accepts commands and dispatches to models
from multiprocessing import Queue as MultiQueue
from threading import Thread
from server.helper import Command
from server.pipelines.text_generation_pipeline import load_model, unload_model, generate_and_cleanup

def process_commands(
    command_queue: "MultiQueue[Command]",
    streaming_queue: "MultiQueue[str | None]"
):
    while True:
        command = command_queue.get(True, None)
        instruction = command["instruction"]
        if(instruction == "completion"):
            model_id = command["model_id"]
            messages = command["messages"]
            streamer = load_model(model_id)
            thread = Thread(target=generate_and_cleanup, args=tuple([messages]))
            thread.start()
            for delta in streamer:
                streaming_queue.put(delta)
            streaming_queue.put(None)
            thread.join()
            unload_model()