---
title: "Video Generation"
description: "Create moving images from text or reference media."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/video-generation.md
sidebar:
  order: 1
---

fo-fal renders the catalogue's video rows marked for fal: MiniMax H3 Max and Seedance 2.5, from a prompt alone or from an image used as the first frame. The finished clip is ordinary project media, added at **Motion clips**. Video Generation is a separate type from Image Generation even when both share a server or a platform.

Each model's resolutions and durations come from the catalogue. Reference-to-video is implemented for Seedance 2.5, from reference images. Video-to-video is a taxonomy entry for future work, not a claim about the current renderer.

## Subtypes

- Text to video — implemented by fo-fal and fo-atlascloud
- Image to video — implemented, from a first frame
- Reference images to video — implemented for Seedance 2.5
- Video to video — future adapters

## Plugins

- [fo-atlascloud](/docs/platforms/atlascloud/)
- [fo-cui](/docs/platforms/comfyui/)
- [fo-fal](/docs/platforms/fal/)
- [fo-wan2gp](/docs/platforms/wan2gp/)

[All types of plugins](../)
