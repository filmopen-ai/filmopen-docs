---
title: "Voice Analysis"
description: "Describe reference audio as voice traits and an original voice-design prompt."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/voice-analysis.md
sidebar:
  order: 1
---

The analyzer returns descriptive voice characteristics and a prompt suitable for designing an original voice. The upload remains reference media; analysis does not create or clone a provider voice ID.

Feed the resulting description to [Voice Generation](../voice-generation/), audition a new voice and explicitly save its provider ID before [Speech Synthesis](../speech-synthesis/).

## Subtypes

- Audio to voice JSON — implemented

## Plugins

- [fo-fal-voice](../../fo-fal-voice/)

[All types of plugins](../)

