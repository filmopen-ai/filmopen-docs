---
title: "Video Generation"
description: "Create moving images from text or reference media."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/video-generation.md
sidebar:
  order: 1
---

fo-fal renders the catalogue's video rows marked for fal: MiniMax H3 Max and Seedance 2.5, from a prompt alone or from an image used as the first frame. The finished clip is ordinary project media, added at **Motion clips**. Video Generation is a separate type from Image Generation even when both share a server or a platform.

Each model's resolutions and durations come from the catalogue. Reference-to-video and video-to-video modes are taxonomy entries for future work, not claims about the current renderer.

## Subtypes

- Text to video — implemented by fo-fal (MiniMax H3 Max, Seedance 2.5)
- Image to video — implemented by fo-fal, from a first frame
- Reference to video / video to video — future adapters

## Plugins

- [fo-fal](../../fo-fal/)

[All types of plugins](../)
