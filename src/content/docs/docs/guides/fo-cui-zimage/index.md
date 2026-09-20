---
title: "fo-cui-zimage: the Z-Image workflow adapter"
description: "A planning draft of fo-cui-zimage, the proposed FilmOpen plug-in that presents Z-Image text-to-image through fo-cui: its inputs, workflow assets, dependencies, stacks and test results."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-zimage/index.md
sidebar:
  label: fo-cui-zimage (planning draft)
  order: 1
---

Status: phase-one planning and successful local experiments, 20 September 2026. This is not yet a packaged FilmOpen plugin.

The proposed plugin presents a text-to-image operation, chooses a compatible Z-Image stack, validates input, prepares a versioned official workflow and calls `fo-cui`. Users supply a prompt and resolution; the stack selects model files and sampling defaults.

## Input contract

The experiment includes a JSON Schema 2020-12 file with these fields:

| Field | Required | Experiment rules |
|---|---|---|
| `prompt` | Yes | Nonempty text |
| `width` | Yes | Integer, 256–1024, multiple of 16 |
| `height` | Yes | Integer, 256–1024, multiple of 16 |
| `seed` | No | Nonnegative JavaScript-safe integer; default 42 |
| `steps` | No | Integer 1–20; default 8 |

These are conservative experiment limits, not a declaration of every resolution the model can generate. Unknown fields are rejected. Final ranges and defaults belong to the selected stack and operation schema. Seed, prompt and workflow/model versions are recorded with results.

## Workflow assets

The stock official Z-Image Turbo and INT8 workflows already expose native subgraph ports for prompt, width, height, seed and steps. Additional ports select diffusion, text-encoder and VAE files. The original templates did not select inputs/outputs for App Mode.

The planning package retains both original templates, the executable API graph produced by ComfyUI's frontend, and an adapted INT8 workflow with native App Mode metadata. The adapted workflow displays the five user controls and SaveImage output without third-party nodes. A separate JSON Schema states which values FilmOpen requires from callers.

Bindings are generated from native boundary links and checked against the exported API graph. Render code sets semantic inputs through those mappings. Graph hashes and class/input checks reject unreviewed workflow changes. This avoids fixed widget-array positions and JSON string replacement; upstream changes still require compatibility review and regenerated bindings.

## INT8 dependencies

| Category | File | Bytes |
|---|---|---:|
| `diffusion_models` | `z_image_turbo_int8_convrot.safetensors` | 6,201,001,296 |
| `text_encoders` | `qwen_3_4b_fp8_mixed.safetensors` | 5,631,994,051 |
| `vae` | `ae.safetensors` | 335,304,388 |

The experiment downloaded and SHA-256 verified these files from official revision `08d04455279082882deaabc8d0d09fc914c071e1`. The package's model manifest carries exact URLs and hashes. Weights are external dependencies, not bundled workflow assets. Workflow licensing and model licensing are separate.

## Proposed stacks

| Label | Workflow / default | Evidence |
|---|---|---|
| 8GB VRAM fast | INT8 Turbo, 512×512, 8 steps | JavaScript render passed on an RTX 4060 laptop |
| 8GB VRAM quality | INT8 Turbo, 1024×1024, 8 steps | Native template render passed; larger-resolution preset, not a measured quality ranking |
| 24GB VRAM fast | INT8 Turbo, 1024×1024, 8 steps | Candidate; 24 GB hardware not tested |
| 24GB VRAM quality | Official BF16 Turbo workflow, 1024×1024 | Candidate; dependencies/export/benchmark still required |

The stack array is a planning proposal. “8GB” does not specify a tested minimum RAM/VRAM envelope, and “quality” does not imply a proven superiority of one precision mode. Do not silently substitute a different stack after OOM.

## Test results

On ComfyUI 0.36.0 with frontend 1.53.6 and template package 0.11.62, the native 1024×1024 run succeeded. Two independent JavaScript requests succeeded at 512×512 and 768×512, taking approximately 24 and 30 seconds end to end. The second prompt contained quotes and a newline. Both downloaded PNGs matched the requested dimensions and were visually inspected. A native App Mode run also succeeded at 512×1024.

The JavaScript tests exercised handshake, model preflight, submission, WebSocket progress, history reconciliation and HTTP output retrieval. Additional tests covered image/WAV transfer, nested image loading, invalid graph rejection and local input validation. These are smoke tests on one machine, not performance guarantees.

## Next phase

Compare required host hooks with the existing plugin specification, implement the final plugin ABI, and add recovery/cancellation and hardware-matrix tests. Qwen, LTX and MiniMax plugins should follow the same division of responsibilities with their own operation schemas, frame constraints, dependencies and evidence.

Sources: [official templates](https://github.com/Comfy-Org/workflow_templates), [official App Mode](https://docs.comfy.org/interface/app-mode), [pinned Z-Image model files](https://huggingface.co/Comfy-Org/z_image_turbo/tree/08d04455279082882deaabc8d0d09fc914c071e1).
