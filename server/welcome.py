import huggingface_hub
from flask import Blueprint, Response
from server.helper import get_body


welcome_blueprint = Blueprint("welcome", __name__)

@welcome_blueprint.route("/welcome/login", methods=[ "POST" ])
def login():
    response = dict()
    try:
        data, status_code = get_body()
        if(data == None):
            return Response(None, status_code)
        token = data.get("token")
        if(not isinstance(token, str)):
            return Response(None, 400)
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
