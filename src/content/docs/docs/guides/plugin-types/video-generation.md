---
title: "Video Generation"
description: "Create moving images from text or reference media."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/video-generation.md
sidebar:
  order: 1
---

The current LTX package accepts an initial image and a motion prompt and produces a short silent clip through ComfyUI. It is a separate type from Image Generation even when both share a server and model-storage infrastructure.

The tested package targets the documented 8 GB stack. Other text, reference and video input modes are taxonomy entries for future work, not claims about the current adapter.

## Subtypes

- Image to video — implemented, short silent LTX clips
- Text to video — future adapters
- Reference to video / video to video — future adapters

## Plugins

- [fo-cui-ltx](../../fo-cui-ltx/)

[All types of plugins](../)

