---
title: "Image Generation"
description: "Create still images from a generation request."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/image-generation.md
sidebar:
  order: 1
---

These packages generate still images from a prompt; fo-fal also edits from a reference image. Each renders the catalogue entries marked for its platform and supplies their options and output receipts; the host imports finished images as ordinary project media. Choosing a different backend does not create a new plugin type.

fo-cui renders Z-Image Turbo on ComfyUI, with model stacks and GPU constraints. fo-fal takes its models and options from the catalogue, including FLUX.2 klein 4B and GPT Image 2.5 editing for character sheets. fo-openai renders GPT Image 2.5 from text only. See each guide for supported settings and cost behavior.

## Subtypes

- Text to image — implemented
- Image to image / reference-guided editing — implemented by fo-fal

## Plugins

- [fo-cui](../../fo-cui/)
- [fo-fal](../../fo-fal/)
- [fo-openai](../../fo-openai/)

[All types of plugins](../)
