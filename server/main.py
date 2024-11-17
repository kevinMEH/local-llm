from multiprocessing import Process, Queue as MultiQueue
from routes import app
from routes import set_command_queue
from routes import set_streaming_queue
from controller import process_commands
from Command import Command

def start_server(
    command_queue: "MultiQueue[Command]",
    global_streaming_queue: "MultiQueue[str | None]"
):
    set_command_queue(command_queue)
    set_streaming_queue(global_streaming_queue)
    app.run(port=2778, debug=False)

if __name__ == "__main__":
    command_queue = MultiQueue()
    global_streaming_queue = MultiQueue()
    routes = Process(target=start_server, args=(command_queue, global_streaming_queue))
    routes.start()
    try:
        process_commands(command_queue, global_streaming_queue)
    except KeyboardInterrupt:
        routes.terminate()
    finally:
        routes.join()