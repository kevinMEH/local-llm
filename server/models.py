import json
from pathlib import Path
from queue import Empty, Full, Queue
from threading import Thread
from time import sleep
from typing import List, Type, cast
from huggingface_hub import (
    scan_cache_dir,
    HFCacheInfo,
    CachedRepoInfo,
    CachedRevisionInfo,
    CachedFileInfo,
    CorruptedCacheException,
    DeleteCacheStrategy
)
from flask import Blueprint, Response
from tqdm.auto import tqdm
from server.helper import get_body, get_field, get_list_field
# A custom snapshot_download function is used, because huggingface_hub
# maintainers were unnaturally unreceptive to the feature request.
# More details here: https://github.com/huggingface/huggingface_hub/pull/2718
from server.custom_download.custom_snapshot_download import custom_snapshot_download


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
    if(isinstance(object, Path)):
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

@models_blueprint.route("/models/download_model", methods=[ "POST" ])
def download_model():
    data = get_body()
    repository = get_field(data, "repository", str)

    tqdm_queue = Queue(1)
    progress_strings: List[List[str]] = []

    class PseudoFile:
        def __init__(self):
            self.contents = ["", "", ""]
            progress_strings.append(self.contents)
        def write(self, desc: str, progress_bar: str, other_info: str):
            self.contents[0] = desc
            self.contents[1] = progress_bar
            self.contents[2] = other_info
            try: tqdm_queue.put(True, False)
            except Full: pass
    class CustomProgressBar():
        def __enter__(self): return self
        def __exit__(self, exception_type, exception_value, traceback): pass
        def __init__(self, initial: int, total: int, desc: str, *args, **kwargs):
            self.file = PseudoFile()
            self.current = initial
            self.total = total
            self.desc = desc
            self.width = 27
            self.previous_bars = -1
            self.bar_changed()
            self.display()
        def update(self, amount=1):
            self.current += amount
            if(self.bar_changed()):
                self.display()
        def bar_changed(self) -> bool:
            current_bars = round(self.current / self.total * self.width * self.bars_count)
            if(self.previous_bars != current_bars):
                self.previous_bars = current_bars
            return True
        bars_characters = u" " + u''.join(map(chr, range(0x258F, 0x2587, -1)))
        bars_count = len(bars_characters)
        def display(self):
            full_bars = self.previous_bars // self.bars_count;
            sub_bars = self.previous_bars % self.bars_count;
            padding = (self.width - full_bars - 1) * self.bars_characters[0];
            bar_string = self.bars_characters[-1] * full_bars + self.bars_characters[sub_bars] + padding
            percentage = str(round(self.current / self.total * 100)) + "%"
            current_unit_string = self.unit_string(self.current)
            total_unit_string = self.unit_string(self.total)
            progress_string = f"{bar_string}"
            other_info = f"{percentage} | {current_unit_string}/{total_unit_string}"
            self.file.write(self.desc, progress_string, other_info)
        units = [ "B", "KB", "MB", "GB" ]
        max_units_index = len(units) - 1
        units_divisor = 1000 # Worse case for user
        def unit_string(self, amount):
            units_index = 0
            while(amount > self.units_divisor and units_index < self.max_units_index):
                amount = amount / self.units_divisor
                units_index += 1
            return f"{round(amount, 2)}{self.units[units_index]}"
    
    def event_stream():
        error = [ False ]
        def snapshot_download_wrapper(repository: str, error: List[bool]):
            try: custom_snapshot_download(
                repo_id=repository,
                skip_outer_tqdm=True,
                inner_tqdm_class=cast(Type[tqdm], CustomProgressBar)
            )
            except Exception as exception:
                error[0] = True
                raise exception
        thread = Thread(target=snapshot_download_wrapper, args=[repository, error])
        thread.start()
        while(thread.is_alive()):
            try:
                tqdm_queue.get(False)
                yield f"event: progress\ndata: {json.dumps(progress_strings)}\n\n"
            except Empty:
                pass
            finally:
                sleep(0.5)
        thread.join()
        if(error[0]):
            yield f"event: error\n\n"
        else:
            yield f"event: progress\ndata: {json.dumps(progress_strings)}\n\n"
            yield f"event: finish\n\n"

    return Response(event_stream(), mimetype="text/event-stream")