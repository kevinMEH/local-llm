import json
from time import sleep
from flask import Blueprint, Response
from multiprocessing import Queue as MultiQueue
from server.helper import get_body, get_field, get_list_field
from server.types.Command import Command, create_command

command_queue: "MultiQueue[Command]"
def set_command_queue(new_queue: "MultiQueue[Command]"):
    global command_queue
    command_queue = new_queue

streaming_queue: "MultiQueue[str | None]"
def set_streaming_queue(new_queue: "MultiQueue[str | None]"):
    global streaming_queue
    streaming_queue = new_queue


routes_blueprint = Blueprint("routes", __name__)

# https://platform.openai.com/docs/api-reference/chat/create
@routes_blueprint.route("/chat/completions", methods=[ "POST" ])
def completions():
    data = get_body()
    model = get_field(data, "model", str)
    messages = get_list_field(data, "messages", str)

    command_queue.put(create_command("completion", model, messages))
    
    def event_stream():
        done = False
        while(not done):
            delta = ""
            while(not streaming_queue.empty()):
                try:
                    fragment = streaming_queue.get(False)
                    if(fragment != None):
                        delta += fragment
                    else:
                        done = True
                except:
                    break
            if(delta != ""):
                result = dict()
                result["v"] = delta
                yield f"event: delta\ndata: {json.dumps(result)}\n\n"
            sleep(0.05)
        yield "data: [DONE]\n\n"
    
    return Response(event_stream(), mimetype="text/event-stream")