---
title: "fo-cui-zimage: Z-Image Turbo"
description: "Render a character image with the pinned Z-Image Turbo INT8 workflow through FilmOpen and ComfyUI."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-zimage/index.md
sidebar:
  label: fo-cui-zimage
  order: 1
---

The first JavaScript package is implemented for FilmOpen API 1/revision 1.
It makes one PNG from text using a pinned Z-Image Turbo INT8 workflow. App
5-2b and the permanent Render UI remain app-agent work; the current actual-app
proof uses a temporary character button on a disposable integration branch.

## Preparation

Enable and allow both fo-cui and fo-cui-zimage. Configure the running ComfyUI
server in fo-cui. This adapter owns no separate server address or key.

Install these files at the roots of their ComfyUI categories:

| Category | File | Bytes |
|---|---|---:|
| diffusion_models | z_image_turbo_int8_convrot.safetensors | 6,201,001,296 |
| text_encoders | qwen_3_4b_fp8_mixed.safetensors | 5,631,994,051 |
| vae | ae.safetensors | 335,304,388 |

The package's assets/models.json pins URLs and hashes at revision
08d04455279082882deaabc8d0d09fc914c071e1. The prepared test server's files were
downloaded and SHA-256 verified separately. Runtime status checks filenames,
node availability and loader selections; it cannot rehash remote weights.
Missing, nested-only or ambiguous filenames are refused. No automatic model
download is provided.

The first supported stack requires CUDA with approximately 8 GB or more VRAM.
Tests use an RTX 4060 laptop; this is not a minimum-memory guarantee across
machines. There is no automatic fallback after OOM.

## Input

```json
{
  "model": "t2i-z-image-turbo",
  "prompt": "woman in a hat",
  "inputs": {},
  "params": { "resolution": "1024x1024", "steps": 8 },
  "seed": 0
}
```

The host supplies the seed, preserving a caller's integer from 0 through
4294967295. This includes zero. Prompt is nonempty text up to 16000 JavaScript
UTF-16 code units.
The stack accepts text only; reference images and negative prompts are not
supported.

The plugin permits 512×512, 768×512, 512×1024 and 1024×1024, always eight steps,
one PNG. Normal app acceptance uses 1024×1024, the current catalogue/stack
intersection. Smaller presets are development options until the app filters
capabilities. num_images must be 1 and output_format must be png when supplied.
Unsupported parameters fail before submission.

The adapter requests a bounded eight-minute nominal polling budget. A tested
8 GB GPU render took about 309 seconds, beyond the earlier five-minute wait.
Network latency adds to the budget and the host retains its own call limit.
If waiting ends first, the job may still complete: it is never automatically
resubmitted. Recovering and attaching its result after the call ends requires
the planned durable host lifecycle.

## The character image

The temporary app button reads the character's positive prompt and calls the
normal host dispatcher. The plugin binds typed values onto a freshly parsed
graph, submits through fo-cui and returns one final descriptor. FilmOpen
downloads it through its media importer, creates the thumbnail/batch and adds
the reference just as for an uploaded image. The first image supplies preview
when absent; later renders create new takes.

The batch records model, platform, prompt, parameters, seed, inputs, stack,
source character and output hash/bytes. The current integration proof checks
seeds 0, 0 and 1 and reopening the project. Repeated pixels on the pinned
same-machine stack do not promise byte identity across hardware or versions.

See the plugin repository's
[milestone 1-1 results](https://github.com/filmopen-ai/filmopen-plugins/blob/filmopen-plugins-milestone-1-1/docs/FilmOpen-Milestone%201-1%20Results.md)
for actual acceptance and limitations. Permanent app contract validation must
be tested again after 5-2b lands.

## Workflow and future capabilities

Assets retain official UI templates, the native exported API graph, a native
App Mode variant, bindings, hashes and attribution. Each render verifies graph
bytes and binding node classes/fields. inputs.schema.json is the earlier
research input schema; use the production request above for the plugin.

The 8 GB INT8 fast/quality IDs refer to smaller/native resolution presets,
not measured precision-quality rankings. 24 GB/BF16 entries are candidates and
are not selected by the implementation. Model weights are not bundled;
workflow and model licenses are separate.

Local estimateCost is zero external API charge. It does not determine a public
sharing price. x.sharingProposal marks only this model's render as a future
candidate, disabled by default; it enables no sharing. App/web will own audience,
availability, image-unit pricing, job storage, meaningful-output verification
and credits. ComfyUI's internal operations stay private. Durable jobs,
targeted cancellation and media-input models follow later milestones.

Sources: [official templates](https://github.com/Comfy-Org/workflow_templates),
[official App Mode](https://docs.comfy.org/interface/app-mode),
[pinned model files](https://huggingface.co/Comfy-Org/z_image_turbo/tree/08d04455279082882deaabc8d0d09fc914c071e1).
