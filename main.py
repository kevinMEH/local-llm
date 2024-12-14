from sys import argv
from multiprocessing import Process, Queue as MultiQueue
from server.routes import app
from server.routes import set_command_queue
from server.routes import set_streaming_queue
from server.processor import process_commands
from server.Command import Command
from waitress import serve

def start_server(
    command_queue: "MultiQueue[Command]",
    global_streaming_queue: "MultiQueue[str | None]"
):
    set_command_queue(command_queue)
    set_streaming_queue(global_streaming_queue)
    if("--production" in argv):
        serve(app, port=2778)
    else:
        app.run(port=2778)

if __name__ == "__main__":
    command_queue = MultiQueue()
    global_streaming_queue = MultiQueue()
    routes = Process(target=start_server, args=(command_queue, global_streaming_queue))
    routes.start()
    status = 0
    try:
        process_commands(command_queue, global_streaming_queue)
    except KeyboardInterrupt:
        routes.terminate()
    except Exception as exception:
        print("Exception encountered while processing commands:")
        print(exception)
        routes.terminate()
        status = -1
    finally:
        routes.join()
        exit(status)