---
title: "Image Generation"
description: "Create still images from a generation request."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/image-generation.md
sidebar:
  order: 1
---

These packages generate still images from a prompt; fo-fal also edits from a reference image. Model adapters and the fal renderer supply options and output receipts; the host imports finished images as ordinary project media. Choosing a different backend does not create a new plugin type.

Z-Image via ComfyUI has model stacks and GPU constraints. The fal renderer takes its models and options from the catalogue, including FLUX.2 klein 4B and GPT Image 2.5 editing for character sheets. The direct OpenAI adapter remains text to image. See each guide for supported settings and cost behavior.

## Subtypes

- Text to image — implemented
- Image to image / reference-guided editing — implemented by fo-fal

## Plugins

- [fo-cui-zimage](../../fo-cui-zimage/)
- [fo-fal](../../fo-fal/)
- [fo-openai-gptimage25](../../fo-openai-gptimage25/)

[All types of plugins](../)
