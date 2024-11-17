from multiprocessing import Process, Queue as MultiQueue
from threading import Thread
from typing import Tuple
from routes import app, start_streaming_processor
from routes import set_command_queue as routes_set_command_queue
from routes import set_global_streaming_queue as routes_set_global_streaming_queue
from controller import start_commands_processor
from Command import Command

def start_server(
    command_queue: "MultiQueue[Command]",
    global_streaming_queue: "MultiQueue[Tuple[str, str | None]]"
):
    routes_set_command_queue(command_queue)
    routes_set_global_streaming_queue(global_streaming_queue)
    thread = Thread(target=start_streaming_processor)
    thread.start()
    app.run(port=2778, debug=False)
    thread.join()

if __name__ == "__main__":
    command_queue = MultiQueue()
    global_streaming_queue = MultiQueue()
    routes = Process(target=start_server, args=(command_queue, global_streaming_queue))
    routes.start()
    try:
        start_commands_processor(command_queue, global_streaming_queue)
    except KeyboardInterrupt:
        routes.terminate()
    finally:
        routes.join()