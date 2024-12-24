import json
from pathlib import PosixPath
from queue import Empty, Full, Queue
from threading import Thread
from time import sleep
from typing import List
from huggingface_hub import (
    scan_cache_dir,
    snapshot_download,
    HFCacheInfo,
    CachedRepoInfo,
    CachedRevisionInfo,
    CachedFileInfo,
    CorruptedCacheException,
    DeleteCacheStrategy
)
from flask import Blueprint, Response
from server.helper import get_body, get_field, get_list_field


models_blueprint = Blueprint("models", __name__)

def serialize(object):
    if(isinstance(object, HFCacheInfo)):
        return object.__dict__
    if(isinstance(object, CachedRepoInfo)):
        return object.__dict__
    if(isinstance(object, CachedRevisionInfo)):
        return object.__dict__
    if(isinstance(object, CachedFileInfo)):
        return object.__dict__
    if(isinstance(object, DeleteCacheStrategy)):
        return object.__dict__
    if(isinstance(object, frozenset)):
        return list(object)
    if(isinstance(object, PosixPath)):
        return str(object)
    if(isinstance(object, CorruptedCacheException)):
        return str(object)
    return object

@models_blueprint.route("/models/get_cache", methods=[ "POST" ])
def get_cache():
    cache = scan_cache_dir()
    response = json.dumps(cache, default=serialize)
    return Response(response, mimetype="application/json")

@models_blueprint.route("/models/preview_delete_revisions", methods=[ "POST" ])
def preview_delete_revisions():
    cache = scan_cache_dir()
    data = get_body()
    revisions = get_list_field(data, "revisions", str)
    strategy = cache.delete_revisions(*revisions)
    response = json.dumps(strategy, default=serialize)
    return Response(response, mimetype="application/json")

@models_blueprint.route("/models/delete_revisions", methods=[ "POST" ])
def delete_revisions():
    response = dict()
    cache = scan_cache_dir()
    data = get_body()
    revisions = get_list_field(data, "revisions", str)
    strategy = cache.delete_revisions(*revisions)
    strategy.execute()
    response["success"] = True
    return response

