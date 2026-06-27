# Script Communicator X

> A sample URCapX that sends URScript over the Primary/Secondary interface and
> retrieves values back from the URScript runtime.

Built and tested on the PolyScopeX SDK dev container **0.20.49**.

---

## Project info

| | |
|------------------|-----------------------------------------|
| **Created**      | 2025-Nov-25                             |
| **Last updated** | 2026-Jun-27                             |
| **Place**        | Shanghai                                |

---

## Overview

This contribution demonstrates two-way communication with the URScript runtime:

- **Send URScript** to the controller over the Primary/Secondary port (e.g. trigger a
  `popup`, or run an inline script).
- **Read values back** from the running script via an XML-RPC backend daemon
  (e.g. fetch the current TCP Z value).

It is made of two parts:

- `script-communicator-x-frontend/` — the Angular application node (UI).
- `script-communicator-x-backend/` — a Python XML-RPC daemon that owns the socket to the
  controller and relays values back to the frontend.

---

## Prerequisites

- PolyScopeX SDK dev container **0.20.49**
- Node.js + npm (provided by the dev container)
- A running URSim / robot reachable from the container

---

## Getting started

Run the following from the project root (`script-communicator-x/`):

| Step          | Command                  | Description                                                                 |
|---------------|--------------------------|-----------------------------------------------------------------------------|
| Install       | `npm install`            | Install dependencies.                                                        |
| Build         | `npm run build`          | Build the backend image and the frontend bundle.                            |
| Deploy        | `npm run install-urcap`  | Package and install the URCapX into the simulator.                          |
| Clean deps    | `npm run clean-urcap`    | Remove the SDK dependencies that were added at project creation.            |

> After `clean-urcap`, run `npm install` again to re-add the dependencies declared in
> [`package.json`](package.json).

To target a specific simulator port, append it, e.g.:

```bash
npm run install-urcap -- --port 45000
```

---

## How it works

When the application node opens, the frontend connects to the backend daemon over XML-RPC
and calls into these functions
(`script-communicator-x-backend/src/script-communicator-daemon.py`):

| Function                        | Purpose                                                            |
|---------------------------------|-------------------------------------------------------------------|
| `setup_socket()`                | Open the socket to the controller (Primary/Secondary).            |
| `close_socket()`                | Close the socket.                                                 |
| `popup(message)`                | Send a URScript `popup(...)` to the controller.                  |
| `get_actual_joint_positions()`  | Run an inline script and return a value (e.g. the TCP Z value).  |
| `set_return_value(value)`       | Called from URScript to push a value back to the daemon.         |
| `get_return_value()`            | Read the last value pushed back from URScript.                   |

Typical flow: the frontend calls `setup_socket` → `popup` → `get_actual_joint_positions`,
which sends a script containing `script_com.set_return_value(...)`; the daemon stores the
value and returns it to the UI.

---

## Further help

Get more help from the included SDK documentation, or contact
FuNing Hu &lt;funh@universal-robots.com&gt;.

---

## License

Released under the **MIT License**. The software is provided "as is", without warranty of
any kind. You are free to use, copy, modify, and distribute it, provided the original
copyright and license notice are retained. See the full text in [LICENSE](LICENSE).
