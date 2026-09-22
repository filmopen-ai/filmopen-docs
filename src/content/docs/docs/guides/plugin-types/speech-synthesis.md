---
title: "Speech Synthesis"
description: "Generate spoken audio from text and a saved voice ID."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/speech-synthesis.md
sidebar:
  order: 1
---

The host sends spoken text and the selected persistent voice binding. The ElevenLabs adapter returns audio for ordinary project-media ingestion and a usage receipt.

An uploaded WAV or MP3 alone is not a reusable ElevenLabs voice ID. Use [Voice Generation](../voice-generation/) to design, audition and save a voice first. The current integration produces 24 kHz WAV; streaming and cloning are outside its implemented scope.

## Subtypes

- Text + provider voice ID to WAV — implemented

## Plugins

- [fo-elevenlabs](../../fo-elevenlabs/)

[All types of plugins](../)

