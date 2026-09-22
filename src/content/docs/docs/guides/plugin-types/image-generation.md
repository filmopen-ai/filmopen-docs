---
title: "Image Generation"
description: "Create still images from a generation request."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/image-generation.md
sidebar:
  order: 1
---

Current packages implement text to image. Model adapters supply options, workflows and output receipts; the host imports finished images as ordinary project media. Choosing a different backend does not create a new plugin type.

Z-Image via ComfyUI has model stacks and GPU constraints. Cloud Z-Image and GPT Image expose provider options and estimated costs. See each guide for its actual supported settings; image-to-image editing is not implemented by these packages.

## Subtypes

- Text to image — implemented
- Image to image / reference-guided editing — future adapters

## Plugins

- [fo-cui-zimage](../../fo-cui-zimage/)
- [fo-fal-zimage](../../fo-fal-zimage/)
- [fo-openai-gptimage25](../../fo-openai-gptimage25/)
- [fo-fal-gptimage25](../../fo-fal-gptimage25/)

[All types of plugins](../)

