from random import random
from typing import Dict, List, TypedDict

class Conversation(TypedDict):
    id: str
    title: str
    model_id: str
    messages: List[str]

database: Dict[str, Conversation] = dict()

def random_id(length: int) -> str:
    characters = "0123456789ABCDEF"
    result = ""
    for i in range(length):
        if(i % 4 == 0 and i != 0):
            result += "-"
        result += characters[int(random() * 16)]
    return result

def new_conversation(title: str, model_id: str) -> Conversation:
    id = random_id(16)
    conversation: Conversation = {
        "id": id,
        "title": title,
        "model_id": model_id,
        "messages": []
    }
    database[id] = conversation
    return conversation

def get_conversation(id: str) -> Conversation | None:
    return database.get(id)

def delta_response(id: str, delta: str):
    conversation = database.get(id)
    if(conversation != None):
        last_message = conversation["messages"][-1]
        conversation["messages"][-1] = last_message + delta
    else:
        print(f"ERROR: deltaResponse called with nonexistant conversation: {id}")