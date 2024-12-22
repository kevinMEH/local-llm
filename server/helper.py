from typing import Any, Dict, Literal, Type, TypeVar, TypedDict, List
from flask import request, Blueprint, Response

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


helper_blueprint = Blueprint("helper", __name__)

class BadJsonException(Exception):
    pass

@helper_blueprint.app_errorhandler(BadJsonException)
def handle_bad_json(exception):
    return Response(None, 415)

class InvalidFieldException(Exception):
    pass

@helper_blueprint.app_errorhandler(InvalidFieldException)
def handle_invalid_field(exception):
    return Response(None, 400)

def get_body() -> Dict[str, Any]:
    data = request.get_json(silent=True)
    if(data == None):
        raise BadJsonException
    if(not isinstance(data, dict)):
        raise InvalidFieldException
    return data

T = TypeVar("T")
def get_field(data: Dict[str, Any], field: str, type: Type[T]) -> T:
    item = data.get(field)
    if(not isinstance(item, type)):
        raise InvalidFieldException
    return item

def get_list_field(data: Dict[str, Any], field: str, subtype: Type[T]) -> List[T]:
    items = data.get(field)
    if(not isinstance(items, list)):
        raise InvalidFieldException
    try:
        items = [ subtype(item) for item in items ]
    except:
        raise InvalidFieldException
    return items