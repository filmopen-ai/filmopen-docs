---
title: "Voice Generation"
description: "Design and audition an original reusable voice from a description."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/voice-generation.md
sidebar:
  order: 1
---

Voice Design returns audition media. An explicit selection creates a persistent provider voice ID, which the host stores alongside reference metadata. This ID is needed later to synthesize new speech in that voice.

This operation differs from [Speech Synthesis](../speech-synthesis/): a voice design establishes how a voice sounds; synthesis speaks supplied text. Both functions currently live in one ElevenLabs package. Voice cloning is not implemented.

## Subtypes

- Prompt to voice design — implemented
- Save selected design as a provider voice — implemented

## Plugins

- [fo-elevenlabs](../../fo-elevenlabs/)

[All types of plugins](../)

