# Interactions

Main process spawns routes process, and starts processing commands. Creates command queue and global streaming queue for IPC between self and routes process.
- `routes.py`
- `controller.py`

## Routes Process

Uses Flask as server. Uses `database.py`

Spawns thread to process global streaming queue into local streaming queue. Global streaming queue contents need to be filtered in case multiple generations are requested.

- Uses `database.py`

## Controller Process (Main)

Processes commands and spawns child processes that will generate output into global streaming queue.

- Uses model templates in model folder