import huggingface_hub
from flask import Blueprint
from server.helper import get_body, get_field


welcome_blueprint = Blueprint("welcome", __name__)

@welcome_blueprint.route("/welcome/login", methods=[ "POST" ])
def login():
    response = dict()
    try:
        data = get_body()
        token = get_field(data, "token", str)
        huggingface_hub.login(token)
        response["success"] = True
    except:
        response["success"] = False
    finally:
        return response

@welcome_blueprint.route("/welcome/logged_in", methods=[ "POST" ])
def logged_in():
    response = dict()
    try:
        huggingface_hub.whoami()
        response["success"] = True
    except:
        response["success"] = False
    finally:
        return response
