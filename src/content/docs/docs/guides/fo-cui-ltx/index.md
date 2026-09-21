---
title: "fo-cui-ltx: short image-to-video"
description: "Animate a project reference image with a small local LTX stack."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui-ltx/index.md
sidebar:
  label: fo-cui-ltx
  order: 1
---

This adapter implements `i2v-ltx-video-2b-0.9.8-distilled` through **fo-cui**. It uses LTX-Video 2B 0.9.8 distilled FP8 and the T5 XXL FP8 text encoder; exact URLs, sizes, hashes and workflow bindings are pinned in the package assets.

The tested envelope is a short **silent** clip from one project reference image, using a low-resolution 8 GB GPU stack. The proof exercised square 384/512-pixel clips with 49 frames. This is not an implementation of newer LTX-2, MiniMax H3, generated speech or lip synchronization.

Enable both packages, configure ComfyUI and install the pinned models/nodes. Supply the existing project image as `inputs.first_frame`; the host binds it to a permitted media descriptor. The model adapter sends that descriptor to `fo-cui:uploadImage`, binds the server-returned image name, prompt and seed into its graph, and receives an MP4 descriptor for ordinary FilmOpen media ingestion.

The temporary app's **Render video** control uses the first character reference image and a prompt such as “woman says hello.” That phrase describes visual motion only; the stack produces no audio. Actual prompt adherence and production quality need their own evaluation.

The permanent host must provide the bounded upload/insertion contract before release. Uploads remain on the ComfyUI server; automatic owned-input retention/cleanup is not yet implemented. Uncertain jobs are never automatically resubmitted, and the plugin does not interrupt unrelated GPU work.

See [fo-cui](../fo-cui/) for connection and failure behavior. Model source: [Lightricks LTX-Video](https://github.com/Lightricks/LTX-Video).
