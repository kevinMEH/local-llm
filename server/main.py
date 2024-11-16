from multiprocessing import Process, Queue as MultiQueue
from threading import Thread
from typing import List, Literal, Tuple
from routes import app, set_global_streaming_queue, set_command_queue, start_streaming_processor

type Command = Literal["completion"]

def start_server(
    command_queue: MultiQueue[Tuple[Command, List[str]]],
    global_streaming_queue: MultiQueue[Tuple[str, str | None]]
):
    set_command_queue(command_queue)
    set_global_streaming_queue(global_streaming_queue)
    thread = Thread(target=start_streaming_processor)
    thread.start()
    app.run(port=2778, debug=False)

if __name__ == "__main__":
    command_queue = MultiQueue()
    global_streaming_queue = MultiQueue()
    routes = Process(target=start_server, args=(command_queue, global_streaming_queue))
    routes.start()
    routes.join()
    print("after join")