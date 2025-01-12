# local-llm

Local LLM enables you to run Large Language Models (LLMs) and other AI models
locally on your computer without requiring access to the internet.

## Installation

For the smoothest installation, you will need to install a virtual environment
manager like Mamba.

To install Mamba, please refer to the official documentation here:

### https://mamba.readthedocs.io/en/latest/installation/mamba-installation.html

Tip: If you are using Windows, add the following path to your PATH environment
variable: `C:\Users\Username\miniforge3\condabin`, replacing `Username` with
your current user profile's username. If you do not know how to do this, please
search up "windows add to path".

Tip: If you are using Windows, run `mamba init`. Make sure to let the changes
through your antivirus.

Tip: To stop conda from invasively activating itself upon every startup of your
terminal application, run `conda config --set auto_activate_base false`.

We will be using Mamba to install most of our Python dependencies because pip is
an extremely unintelligent and poorly programmed package manager that takes a
long time to install packages.

First, create an environment and activate it using mamba:

```sh
mamba create -n "local-llm"
# Run activate with both mamba and conda in case mamba does not work.
mamba activate local-llm
conda activate local-llm
```

Then, install Node if you do not have it installed:

```sh
# If you do not have Node installed on your system, install Node below
mamba install -y nodejs # Installs Node and npm
```

Then, install backend dependencies with Mamba:

```sh
mamba install -y transformers accelerate flask waitress -c pytorch -c nvidia
```

Then, install frontend dependencies with npm:

```sh
npm install
```

## Usage

First, ensure that the virtual environment for the project is activated:

```sh
# Run activate with both mamba and conda in case mamba does not work.
mamba activate local-llm
conda activate local-llm
```

Then, run

```sh
node start.js
```

If you ever make changes to the Javascript code of local-llm, please run

```sh
node start.js --build
```

to force local-llm to recompile the frontend and intermediate server layer.
