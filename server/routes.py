from time import sleep
from flask import Flask, Response, request
from typing import Any, Dict, Tuple
from queue import Queue as SingleQueue
from multiprocessing import Queue as MultiQueue
from database import new_conversation, get_conversation, delta_response
from Command import Command, create_command

command_queue: "MultiQueue[Command]"
def set_command_queue(new_queue: "MultiQueue[Command]"):
    global command_queue
    command_queue = new_queue

streaming_queue: "MultiQueue[str | None]"
def set_streaming_queue(new_queue: "MultiQueue[str | None]"):
    global streaming_queue
    streaming_queue = new_queue

def get_body() -> Tuple[None | Dict[str, Any], int]:
    data = request.get_json(silent=True)
    if(data == None):
        return (None, 415)
    if(not isinstance(data, dict)):
        return (None, 400)
    return (data, 200)


app = Flask(__name__)

@app.route("/new_chat", methods=[ "POST" ])
def new_chat():
    data, status_code = get_body()
    if(data == None):
        return Response(None, status_code)
    title = data.get("title")
    model_id = data.get("model_id")
    if(not isinstance(title, str) or not isinstance(model_id, str)):
        return Response(None, 400)
    return new_conversation(title, model_id)

@app.route("/chat", methods=[ "POST" ])
def chat():
    data, status_code = get_body()
    if(data == None):
        return Response(None, status_code)
    id = data.get("id")
    message = data.get("message")
    if(not isinstance(id, str) or not isinstance(message, str)):
        return Response(None, 400)
    conversation = get_conversation(id)
    if(conversation == None):
        return Response(None, 400)
    
    conversation["messages"].append(message) # User message
    conversation["messages"].append("") # Assitant message
    command_queue.put(create_command("completion", conversation["model_id"], conversation["messages"][:-1].copy()))

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
                delta_response(id, delta)
                yield f"event: delta\ndata: {delta}\n\n"
            sleep(0.5)

    return Response(event_stream(), mimetype="text/event-stream")
