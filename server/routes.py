import json
from time import sleep
from flask import Blueprint, Response
from multiprocessing import Queue as MultiQueue
from server.helper import get_body, Command, create_command

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
    data, status_code = get_body()
    if(data == None):
        return Response(None, status_code)
    model = data.get("model")
    messages = data.get("messages")
    if(not isinstance(messages, list) or not isinstance(model, str)):
        return Response(None, 400)
    try:
        messages = [ str(message) for message in messages ]
    except:
        return Response(None, 400)

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