from typing import Any, Dict, Tuple, Literal, TypedDict, List
from flask import request

type Instruction = Literal["completion"]

# IMPORTANT: MUST BE SERIALIZABLE so I will use dict
class Command(TypedDict):
    instruction: Instruction
    model_id: str
    messages: List[str]

def create_command(instruction: Instruction, model_id: str, messages: List[str]) -> Command:
    return {
        "instruction": instruction,
        "model_id": model_id,
        "messages": messages
    }

def get_body() -> Tuple[None | Dict[str, Any], int]:
    data = request.get_json(silent=True)
    if(data == None):
        return (None, 415)
    if(not isinstance(data, dict)):
        return (None, 400)
    return (data, 200)