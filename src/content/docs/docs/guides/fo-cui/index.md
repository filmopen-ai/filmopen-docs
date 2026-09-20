---
title: "fo-cui: the ComfyUI communication service"
description: "A planning draft of fo-cui, the proposed shared service FilmOpen model plug-ins use to reach a ComfyUI server: discovery, uploads, jobs, progress, errors and outputs."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui/index.md
sidebar:
  label: fo-cui (planning draft)
  order: 1
---

Status: tested research adapter and implementation plan, 20 September 2026. The architecture review has been answered. The first package targets FilmOpen API 1, revision 1; the host's new interface support and production plug-in integration are still in development.

`fo-cui` is the proposed shared service used by model plugins such as `fo-cui-zimage`. Its first implementation handles health, hardware/dependency discovery, bounded workflow jobs, errors and output references. Model plugins supply operation schemas, stack selection and executable graphs. Large-file installation, reference-media uploads and durable jobs are later capabilities, not available package features.

## Connection and discovery

For a configured local ComfyUI URL, query `/system_stats`, `/features`, `/models`, relevant `/models/{category}` lists, and `/object_info/{nodeClass}`. Validate response shapes and required node classes. Use device `vram_total` and `vram_free` as byte counts; allocator counters are separate. Available VRAM and host RAM influence stack selection, but do not alone guarantee that a job fits.

Model lists identify categories and relative filenames. Capability-test `/experiment/models` and `/experiment/models/{category}` if physical roots, file sizes and `pathIndex` are needed. They are experimental and may be unavailable. A category can span multiple roots; remote paths are not local host paths. Check hashes to distinguish different files with the same name.

The base service should delegate installation to a host download/filesystem service: select a configured root, verify free space and existing files, download a pinned revision to a temporary file, verify SHA-256, finalize atomically and refresh discovery. A direct HTTP connection does not imply permission or capability to write the ComfyUI machine's model folders.

## Executing a workflow

The direct server API expects executable API JSON, not the UI-save graph. Obtain it using ComfyUI's native exporter/submission path. Native subgraphs and App Mode provide authoring interfaces; model adapters bind a stable public input schema to a reviewed, versioned API graph.

1. Validate typed inputs and required dependencies.
2. POST `/prompt` with `{prompt: graph}` and retain the returned `prompt_id`.
3. Poll `/history/{prompt_id}` through `ctx.http`, using `ctx.sleep` and a bounded poll count.
4. Require successful completion and read final file references from history.
5. Return server-relative output descriptors; FilmOpen downloads through `/view`, validates the media and records it with generation provenance.

The Node research adapter also used WebSocket progress, but the first FilmOpen package needs neither a WebSocket nor a generated client ID. It runs inside the host's bounded call. Reference-media upload and durable receipt/reconnect support require later host interfaces.

Use a freshly parsed/copied graph and structured assignments followed by JSON serialization. Never replace raw text inside workflow JSON. Bindings should include a workflow hash and expected node class/input names, so incompatible changes fail before submission.

## Media and output handling

`/upload/image` accepts multipart data with a binary `image` part and `type`, `subfolder`, `overwrite` fields. Always use the returned name and subfolder. PNG upload, deduplication, byte-exact download and loading a nested image path were tested. The tested server also accepted a WAV through this endpoint; video codecs, mask handling and audio execution require their own tests.

Loader field names vary: `LoadImage.image`, `LoadAudio.audio` and `LoadVideo.file` are examples. Some dropdowns omit nested files even when loaders accept their paths. Subfolders help avoid collisions; they do not provide user isolation.

Final file references normally contain `filename`, `subfolder` and `type`. Encode query parameters when calling `/view`. Keep node ID/output role and preserve multi-output jobs. Preview bytes are not final output assets. An output URL may expire with server retention; collect a durable host copy.

## Status, errors and cancellation

Expose preparation/upload, queued/running, download and terminal states. Sampling progress is node-level progress. `executed` is not whole-job success. Check history for a successful completed state and execution error/interruption messages. Keep structured server validation errors and node diagnostics.

A client timeout does not cancel a server job. A timeout during submission can leave acceptance uncertain; reconcile before resubmitting. History may be absent while a job is queued/running or after a restart/retention event. Use persisted job receipts and report an unknown state when necessary.

Prefer capability-tested job-specific cancellation. Do not use a legacy global interrupt or queue clear as routine cancellation for one FilmOpen render.

## Host integration needs

The first package uses the QuickJS host's `ctx.http`, `ctx.call`, `ctx.assets`, `ctx.sleep`, logging and progress. The sandbox has no Node imports, fetch, WebSocket, timers, Date or random-number API. The platform interface supplies `run` and `request`, plus universal `status`; the model plugin calls that platform. The host owns media bytes and project ingestion. The existing developer panel can exercise typed functions through MCP, but the new interface contract still needs end-to-end host validation.

Durable jobs, scoped cancellation after a call ends, binary upload and trusted large-file installation remain separate host work. A stopped call does not prove that ComfyUI stopped the GPU job.

An optional transport can use the official TypeScript SDK and Comfy API v2 through a compatible deployment or local proxy. The directly tested ComfyUI server supports the raw endpoints above; its `/api/v2/jobs` route returned 404. Keep those transports distinct.

## Future sharing

This platform service's raw requests, workflows, queue controls and discovery are not intended for remote sharing. A future shareable model operation, such as Z-Image render, will accept a constrained model input through FilmOpen's authenticated dispatcher. The app and relay will own opt-in, access, pricing, transfer and result verification. Local plugin calls do not automatically enable sharing.

## References

- [ComfyUI server API](https://docs.comfy.org/development/comfyui-server/comms_routes)
- [Official TypeScript SDK and self-hosted proxy requirements](https://github.com/Comfy-Org/comfy-typescript-sdk)
- [Native subgraph developer guide](https://docs.comfy.org/custom-nodes/js/subgraphs)
