
from typing import List, Literal, TypedDict

Instruction = Literal["completion"]

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
