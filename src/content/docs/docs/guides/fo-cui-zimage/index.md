---
title: "fo-cui-zimage: local Z-Image Turbo"
description: "Choose a pinned 8 GB Fast, 8 GB Quality or 24 GB Z-Image stack."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-zimage/index.md
sidebar:
  label: fo-cui-zimage
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).

Render a still image from a prompt through [ComfyUI](../fo-cui/). This model adapter owns the pinned workflow and stack settings; FilmOpen owns the render dialog, jobs and media insertion.

Use **fo-cui-zimage v2 or later** with an app supporting plugin interface revision **2**. This release supplies all three stacks to the permanent render dialog, including their resolution choices and reasons a stack cannot run.

## Set up and render

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-cui** and **fo-cui-zimage**. Configure the full ComfyUI URL and complete its **Check**.
2. For automatic file verification/downloads, start and configure the separate [model verification service](../fo-cui/#enable-model-verification-and-downloads). A connection Check does not install any weights.
3. Open the Z-Image plugin's **Actions**. Run **Download missing files: 8 GB Fast** for a small local test, or the matching Quality action. Wait for a successful result; follow any reported missing-service or file error. This action prepares files and **does not render an image**.
4. Open an editable character. In **Reference images**, use its add control and choose **Render**.
5. Select Z-Image Turbo under **Model**, the local ComfyUI destination under **Runs on** when there is a choice, and **8 GB Fast** under **Way of running it**.
6. Choose **512×512**, enter a short **Prompt**, and press **Render**. Follow the job until it completes. Open the new image tile and confirm it was added to this character.
7. Change **Way of running it** to **8 GB Quality**. Resolution now offers **512×512** and **1024×1024**, while Fast offers only **512×512**. Choose the desired size before another render. On an 8 GB GPU, **24 GB Quality** must be unavailable with a message explaining its 24 GB VRAM requirement.

## Stacks

| Stack | Diffusion file | Resolution | Default settings |
|---|---|---|---|
| 8 GB Fast | `z_image_turbo_int8_convrot.safetensors` | 512×512 | 8 steps, Euler, simple scheduler |
| 8 GB Quality | `z_image_turbo_bf16.safetensors` | 512×512 or 1024×1024 | 9 steps, res_multistep, simple scheduler |
| 24 GB Quality | `z_image_turbo_bf16.safetensors` | 1024×1024 | 9 steps, res_multistep, simple scheduler |

The 8 GB stacks use `qwen_3_4b_fp8_mixed.safetensors`; the 24 GB stack uses `qwen_3_4b.safetensors`. All use `ae.safetensors`. These belong at the category roots `diffusion_models`, `text_encoders` and `vae`. Package assets pin the source URLs, byte sizes, hashes and graphs.

Quality uses BF16 with CPU offloading on the tested 8 GB configuration. Its name is a preset label, not a measured quality ranking. System RAM, available GPU memory and other workloads can still prevent rendering. The selected stack controls its graph, requirements and supported sizes; unsupported combinations are refused.

## If preparation or rendering fails

- **Check succeeds, download does nothing:** confirm the separate model helper is running and **Model verification service** is set. An unset helper makes the Z-Image action fail with `model-service-unconfigured`; an unreachable helper returns `model-service-unavailable`. A UI that only says Done has not established that files were installed.
- **Files missing or corrupt:** inspect the action result and helper process. Verification checks the pinned byte sizes and SHA-256 hashes; repair downloads missing files only. Run **Verify** again after repair, then return to **Render**. Existing corrupt files require operator review before removal and repair.
- **No stack ready:** confirm the selected server, GPU, model categories and required nodes. Model files on another ComfyUI installation do not count.
- **Salad selected:** choose a stack that its deployed recipe actually installed. The supplied Salad recipe installs BF16 Quality weights, not the local INT8 Fast stack.
- **Render timed out:** inspect the outstanding job before retrying. Rechecking dependencies is read-only; it is not a second render.

The package logs dependency and backend failures without logging prompt text. The local estimate means no external image API charge; electricity and cloud GPU time are separate. This adapter currently takes a text prompt, not reference-image editing. Proposed sharing exposes only a bounded named render; it enables no relay.
