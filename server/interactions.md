# Interactions

Main process spawns routes process, and starts processing commands. Creates command queue and streaming queue for IPC between self and routes process.
- `routes.py`
- `processsor.py`

## Routes Process

Uses Flask as server. Uses `database.py` as database.

- Uses `database.py`

## Processor (Main)

Processes commands, spawns threads that will generate output, and streams output into queue.

- Uses model templates in model folder