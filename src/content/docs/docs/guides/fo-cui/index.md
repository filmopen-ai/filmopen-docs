---
title: "fo-cui: the ComfyUI platform"
description: "Connect FilmOpen model plugins to a ComfyUI server for discovery and bounded workflow rendering."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui/index.md
sidebar:
  label: fo-cui
  order: 1
---

The first JavaScript package is implemented against FilmOpen API 1/revision 1.
It runs in Dart's QuickJS engine. App 5-2b and the permanent character Render
UI are still separate app work; current integration uses an explicitly enabled
disposable app branch. See the plugin repository's milestone 1-1 results for
the precise tested revision and reproduction commands.

## Connect

Start ComfyUI, install the dependencies of the model you want to use, then
enable **fo-cui** in FilmOpen and allow its package. Set **ComfyUI server** to
the server address; the default is http://127.0.0.1:8188. Model adapters such as
fo-cui-zimage use this one connection and must be enabled separately.

Status distinguishes an unset address, an unavailable server, a reachable
CPU-only server and a ready GPU server. Model adapters impose their own
requirements; a ready platform does not guarantee a model can run.

## What is available

| Function | Purpose |
|---|---|
| status | Reachability and hardware summary |
| profile | Version, devices, VRAM and RAM reported by ComfyUI |
| files | Relative model filenames in supported categories |
| nodes | Availability and definitions of requested node classes |
| queue | Running/pending job IDs, without other prompts or workflows |
| request | Relative HTTP request through the configured server |
| run | Submit an executable API workflow once and await final outputs |

Model discovery checks names and loader choices. It does not establish
installed weight hashes. Package model manifests pin expected files; installation
and hash verification remain a separate task.

The runtime uses /api/system_stats, /api/models, /api/object_info, /api/prompt,
/api/history and /api/view. A workflow must be an exported executable API graph,
not the UI-save document. The model plugin validates/binds its inputs before
submission.

## Rendering and failure behavior

run submits once, retains the returned prompt ID and polls history with native
ctx.sleep. It requires completed successful history and final output files.
It returns server-relative descriptors; FilmOpen downloads the bytes and saves
media. Temporary previews, invalid paths and absent final output are rejected.

The nominal default polling budget is five minutes; network latency adds to
that budget, and the host has an absolute call limit. A submission/polling
timeout is not permission to resubmit. The diagnostic lastJob receipt is not
a durable job database. Check the server before manually starting another job
whose acceptance is uncertain.

The package never uses global interrupt or whole-queue clearing. Stopping a
FilmOpen call does not prove the server stopped the GPU job. Durable
collect/cancel, reconnect, input-media upload, large-file installation and
progress streaming are later capabilities. Earlier Node research of uploads
and WebSockets does not make those installed-plugin features.

The code uses ctx.http, ctx.call, ctx.asset, ctx.storage, ctx.sleep, signal,
logging and progress. No Node, fetch, WebSocket, timers, Date or generated
random client IDs are required.

## Future sharing

fo-cui has no eligible remote operations. Raw requests, workflow graphs,
discovery and queue controls remain local. The manifest's x.sharingProposal is
an inert design hint, not a sharing permission. Model operations may become
shareable through a later authenticated host/relay contract; app/web own opt-in,
access, availability, pricing, transfers, verification and credits.

The source package and portable tests are in
[filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins).
ComfyUI's protocol is documented in its
[server implementation](https://github.com/Comfy-Org/ComfyUI/blob/master/server.py).
