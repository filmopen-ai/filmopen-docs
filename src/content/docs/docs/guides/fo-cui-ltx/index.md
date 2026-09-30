---
title: "fo-cui-ltx: short image-to-video"
description: "Animate a project reference image with a small local LTX stack."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-ltx/index.md
sidebar:
  label: fo-cui-ltx
  order: 1
---

Plugin types: [Video Generation](../plugin-types/video-generation/).

This adapter implements `i2v-ltx2b-098-distilled` through [fo-cui](../fo-cui/): LTX-Video 2B 0.9.8 distilled FP8 with a T5 XXL FP8 text encoder. It produces short **silent** MP4 clips from one still image. It is not newer LTX-2, MiniMax H3, speech generation or lip synchronization.

Use **fo-cui-ltx v3 or later** with an app supporting plugin interface revision **2**. This release supplies the render dialog's resolution choices and readiness checks.

## Set up

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-cui** and **fo-cui-ltx**, and configure the running ComfyUI server.
2. Install the exact files in the package's `assets/models.json`, at the categories it names, and ensure the nodes required by its workflow are installed. Do not substitute a similarly named LTX model: the workflow and file hashes are pinned.
3. Check the LTX plugin's status. It checks the selected server's hardware, loader choices, files and nodes. The Z-Image download actions install Z-Image dependencies, not LTX.
4. For Salad, first ensure a deployed recipe includes these LTX files and nodes. The current Z-Image Salad recipe alone does not supply them; choosing a larger GPU does not install a different model.

### Install the local model files

From the matching filmopen-plugins source checkout, with Python 3.11 or later and the ComfyUI `models/checkpoints` and `models/text_encoders` directories already present, run the checked download helper. Replace the model-root path with the one your ComfyUI process actually uses.

Windows PowerShell:

```powershell
python research/comfyui/download-models.py --manifest fo-cui-ltx/assets/models.json --models "C:/path/to/ComfyUI/models"
```

Linux:

```bash
python3 research/comfyui/download-models.py --manifest fo-cui-ltx/assets/models.json --models "/path/to/ComfyUI/models"
```

This explicit source-checkout helper downloads roughly 9.62 GB and verifies the pinned size/hash. It is separate from the app's production installer. It preserves existing model files and refuses one whose bytes differ. After an interrupted download, inspect its reported `.part` file before trying again.

| Model directory | File |
|---|---|
| `checkpoints` | `ltxv-2b-0.9.8-distilled-fp8.safetensors` |
| `text_encoders` | `t5xxl_fp8_e4m3fn_scaled.safetensors` |

The workflow uses native ComfyUI LTX/video nodes, including `LTXVConditioning`, `LTXVPreprocess`, `LTXVImgToVideo`, `CreateVideo` and `SaveVideo`. If the plugin reports missing nodes, the running ComfyUI must supply them before this stack can run. Restart or refresh ComfyUI's file discovery after installation, then repeat the plugin's Check.

## Render and check a clip

1. Open an editable character and upload a PNG or JPEG into its **Reference images**. Keep the input at or below 16 MiB.
2. Open the add control in **Motion clips** and choose **Render**. Use **Add a place…** to show that media group if needed.
3. Select the LTX model and ComfyUI destination. Under **First frame**, choose the image that should open the clip.
4. Enter a **Motion prompt**, for example “turns towards the camera and smiles.” A request that someone says hello describes visible motion only: this model makes no sound.
5. Set **Resolution** to **384×384** for the first test, then press **Render** once. **512×512** is the other choice and the default; both use 49 frames at 24 fps and 8 steps. These frame, rate and step values are fixed for this workflow.
6. Wait for completion, open the new clip tile and play it. Confirm that the first frame matches the chosen reference and that the MP4 is saved with the character's media.

The host uploads only the chosen authorized project image. Uploading an image is a network transfer to the selected server; the plugin cannot read arbitrary local paths.

If upload support, a required node, a file or GPU memory is missing, fix that prerequisite before submitting again. An uncertain submission is not automatically repeated, and cancelling the FilmOpen wait does not justify interrupting another user's GPU job. Automatic retention cleanup of uploaded ComfyUI input images remains a separate concern.

This procedure describes the current controls and package contract; it is not a new live acceptance result. [Model source](https://github.com/Lightricks/LTX-Video).
