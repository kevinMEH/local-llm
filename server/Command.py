from typing import List, Literal, TypedDict

type Instruction = Literal["completion"]

# IMPORTANT: MUST BE SERIALIZABLE so I will use dict
class Command(TypedDict):
    instruction: Instruction
    id: str
    model_id: str
    messages: List[str]

def create_command(instruction: Instruction, id: str, model_id: str, messages: List[str]) -> Command:
    return {
        "id": id,
        "instruction": instruction,
        "model_id": model_id,
        "messages": messages
    }