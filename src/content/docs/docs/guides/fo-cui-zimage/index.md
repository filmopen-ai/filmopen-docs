---
title: "fo-cui-zimage: local Z-Image Turbo"
description: "Choose a pinned 8 GB Fast, 8 GB Quality or 24 GB Z-Image stack."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-zimage/index.md
sidebar:
  label: fo-cui-zimage
  order: 1
---

Enable **fo-cui** and **fo-cui-zimage**, allow both packages and configure your ComfyUI server. The adapter renders one PNG from a text prompt with the host-assigned seed. The temporary render popup gets its stacks, resolutions and repair action names from the plugin.

| Stack | Diffusion file | Resolution | Default settings |
|---|---|---|---|
| 8 GB Fast | `z_image_turbo_int8_convrot.safetensors` | 512×512 | 8 steps, Euler, simple scheduler |
| 8 GB Quality | `z_image_turbo_bf16.safetensors` | 512×512 or 1024×1024 | 9 steps, res_multistep, simple scheduler |
| 24 GB Quality | `z_image_turbo_bf16.safetensors` | 1024×1024 | 9 steps, res_multistep, simple scheduler |

The 8 GB stacks share `qwen_3_4b_fp8_mixed.safetensors`; the 24 GB stack uses `qwen_3_4b.safetensors`. All use `ae.safetensors`. Files belong in their exact ComfyUI categories: `diffusion_models`, `text_encoders`, and `vae`. The package assets pin URLs, sizes, hashes, workflow templates and bindings.

Each stack selects its own graph and settings. The 8 GB Quality stack uses CPU offloading; its name is a preset label, not a measured quality ranking. Available system RAM and other workloads also matter. The 24 GB stack refuses an 8 GB GPU before submission. It passed a 1024×1024 render and character-media import on a Salad RTX 3090, with 48.54 seconds reported by ComfyUI for the first job. That is one acceptance run, not a broad hardware or quality benchmark. See [the Salad server guide](../fo-salad/).

## Verification and repair

Before rendering, the adapter checks the stack's hardware, nodes, loader choices and exact files. With the separate verification service configured, the pinned bytes/hashes can be checked on the server machine. The explicit **Verify / repair files** action downloads missing files into their specified categories and validates them. Without that service the plugin cannot establish hashes merely by listing filenames.

If ComfyUI fails, the adapter rechecks dependencies and logs the original failure plus diagnostics. It does not silently re-render a potentially charged or already-running job. Repair and another render remain explicit actions.

Changing stacks refreshes the permitted resolutions and corrects an incompatible previous choice. The adapter rejects unknown stack/size/options even if a caller bypasses the UI. The only output is a final PNG descriptor; FilmOpen performs media ingestion and attachment. Permanent render/insertion UI integration is app-owned work.

Only the bounded named render operation is proposed for future sharing. File installation, workflow submission and platform internals remain ineligible. See [ComfyUI platform behavior](../fo-cui/).
