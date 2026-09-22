---
title: "fo-cui: ComfyUI platform"
description: "Connect model adapters to a local or selected ComfyUI server."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui/index.md
sidebar:
  label: fo-cui
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).


Enable **fo-cui**, allow its permissions and set **ComfyUI server** to your running server. The default is `http://127.0.0.1:8188`. Enable a model adapter separately: [Z-Image Turbo](../fo-cui-zimage/) or [LTX video](../fo-cui-ltx/).

The platform provides status, hardware profile, model-file and node discovery, bounded queue information, relative HTTP requests and one-submit workflow execution. It handles exported executable API graphs, not ComfyUI's UI-save documents. Model adapters bind prompts, inputs and seeds into their pinned graphs.

Status distinguishes an unset address, unavailable server, CPU-only server and GPU readiness. Each model applies its own VRAM/node/file requirements. File discovery alone is not a cryptographic verification of model weights.

`run` submits once and polls successful final history. It returns server-relative media descriptors that FilmOpen downloads. Queue errors and failed node execution are surfaced through the host logger. The default polling budget is five minutes, configurable up to eight; the host imposes its own overall limit. A timeout is not permission to resubmit automatically. `lastJob` stores a diagnostic receipt but is not durable job scheduling.

## Model verification and uploads

The optional verification service used by the Z-Image adapter checks pinned file paths, byte sizes and hashes on the ComfyUI machine. Explicit repair downloads missing/corrupt files through that service. Its setup and deployment are separate from ordinary model discovery; a plugin does not get unrestricted filesystem access.

The LTX adapter uses `uploadImage` with a host-owned project-media descriptor. The current app integration needs the experimental bounded upload bridge. Image bytes are uploaded by the host, not read from arbitrary paths by JavaScript.

The platform never clears the whole queue or issues a global GPU interrupt. Stopping a FilmOpen call does not prove the server stopped its job. Durable collect/cancel/reconnect, installation recovery and upload retention remain separate host/service work.

Raw platform operations are not proposed for sharing. A future relay can expose only eligible model operations after host authorization; no manifest hint publishes a server. [ComfyUI protocol implementation](https://github.com/Comfy-Org/ComfyUI/blob/master/server.py).
