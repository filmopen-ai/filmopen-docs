---
title: "Voice Generation"
description: "Design and audition an original reusable voice from a description, or keep one cloned from a recording."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/voice-generation.md
sidebar:
  order: 1
---

Voice Design returns audition media. An explicit selection creates a persistent provider voice ID. The host keeps each sample's `voice_binding` and selects the voice for later speech through the character's `voice.provider_bindings`; an uploaded recording alone creates neither.

This operation differs from [Speech Synthesis](../speech-synthesis/): a voice design establishes how a voice sounds; synthesis speaks supplied text. Both functions live in one package per platform. fo-fish designs voices too, and keeps a voice cloned from a recorded sample; fo-qwen designs none and keeps only a voice cloned from the character's chosen sample.

## Subtypes

- Prompt to voice design — implemented
- Save selected design as a provider voice — implemented
- Clone a provider voice from a recorded sample — implemented by fo-fish and fo-qwen

## Plugins

- [fo-elevenlabs](/docs/platforms/elevenlabs/)
- [fo-fal](/docs/platforms/fal/)
- [fo-fish](/docs/platforms/fishaudio/)
- [fo-qwen](/docs/platforms/qwen/)

[All types of plugins](../)
