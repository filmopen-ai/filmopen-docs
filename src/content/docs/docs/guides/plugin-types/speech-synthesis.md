---
title: "Speech Synthesis"
description: "Generate spoken audio from text."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/speech-synthesis.md
sidebar:
  order: 1
---

For fo-elevenlabs, the host sends spoken text and the selected persistent voice binding. The ElevenLabs adapter returns audio for ordinary project-media ingestion and a usage receipt.

fo-fal renders the catalogue's Eleven v3 speech row on fal from text. Its audio is ordinary project media, added at **Voice samples** or **Sound samples**.

An uploaded WAV or MP3 alone is not a reusable ElevenLabs voice ID. Use [Voice Generation](../voice-generation/) to design, audition and save a voice first. The ElevenLabs integration produces 24 kHz WAV; streaming and cloning are outside its implemented scope.

## Subtypes

- Text + provider voice ID to WAV — implemented
- Text to speech on fal (Eleven v3) — implemented by fo-fal

## Plugins

- [fo-elevenlabs](../../fo-elevenlabs/)
- [fo-fal](../../fo-fal/)

[All types of plugins](../)
