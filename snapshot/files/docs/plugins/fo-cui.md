# fo-cui — ComfyUI communication service

Status: phase-one planning and tested research adapter, 20 September 2026. Final FilmOpen plugin packaging and function signatures await the plugin architecture review.

`fo-cui` is the proposed shared service used by model plugins such as `fo-cui-zimage`. It handles connection health, hardware and dependency discovery, media upload, job submission, progress, errors and output retrieval. Model plugins supply operation schemas, stack selection and executable workflow graphs.

## Connection and discovery

For a configured local ComfyUI URL, query `/system_stats`, `/features`, `/models`, relevant `/models/{category}` lists, and `/object_info/{nodeClass}`. Validate response shapes and required node classes. Use device `vram_total` and `vram_free` as byte counts; allocator counters are separate. Available VRAM and host RAM influence stack selection, but do not alone guarantee that a job fits.

Model lists identify categories and relative filenames. Capability-test `/experiment/models` and `/experiment/models/{category}` if physical roots, file sizes and `pathIndex` are needed. They are experimental and may be unavailable. A category can span multiple roots; remote paths are not local host paths. Check hashes to distinguish different files with the same name.

The base service should delegate installation to a host download/filesystem service: select a configured root, verify free space and existing files, download a pinned revision to a temporary file, verify SHA-256, finalize atomically and refresh discovery. A direct HTTP connection does not imply permission or capability to write the ComfyUI machine's model folders.

## Executing a workflow

The direct server API expects executable API JSON, not the UI-save graph. Obtain it using ComfyUI's native exporter/submission path. Native subgraphs and App Mode provide authoring interfaces; model adapters bind a stable public input schema to a reviewed, versioned API graph.

1. Validate typed inputs and required dependencies.
2. Upload input media and assign the returned server-relative references.
3. Open `/ws?clientId=<uuid>` and register listeners.
4. POST `/prompt` with `{prompt: graph, client_id: uuid}`.
5. Persist the returned `prompt_id` immediately.
6. Follow job events and reconcile with `/history/{prompt_id}`.
7. Read file references from successful history and download through `/view`.
8. Return host-owned assets with MIME type, dimensions/duration and generation provenance.

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

The host must provide async service calls between plugins, events/progress, binary asset handles, package-relative asset reads, durable job storage, HTTP/WebSocket or equivalent transports, cancellation, and trusted large-file installation. The research adapter runs in Node 24; this does not establish availability of Node APIs in the Dart-hosted JavaScript engine.

An optional transport can use the official TypeScript SDK and Comfy API v2 through a compatible deployment or local proxy. The directly tested ComfyUI server supports the raw endpoints above; its `/api/v2/jobs` route returned 404. Keep those transports distinct.

## References

- [ComfyUI server API](https://docs.comfy.org/development/comfyui-server/comms_routes)
- [Official TypeScript SDK and self-hosted proxy requirements](https://github.com/Comfy-Org/comfy-typescript-sdk)
- [Native subgraph developer guide](https://docs.comfy.org/custom-nodes/js/subgraphs)

This is a requested documentation draft. It has not been imported through the documentation site's source-commit publication pipeline or deployed.
