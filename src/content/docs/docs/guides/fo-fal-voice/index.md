---
title: "Voice reference analysis on fal"
description: "Describe a recording as structured voice characteristics and an original voice-design prompt."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-voice/index.md
sidebar:
  label: fo-fal-voice
  order: 1
---

Plugin types: [Voice Analysis](../plugin-types/voice-analysis/).

Describe a reference recording as voice traits and an original voice-design prompt. This package uses `fal-ai/audio-understanding` through [fo-fal](../fo-fal/). It does not clone a voice or create a provider voice ID.

## Set up and analyze

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-fal** and **fo-fal-voice**, then save and verify the fal plugin's key.
2. Open a character you can edit. Under **Voice samples**, use the add control and **Upload** a short, clear WAV or MP3 with one speaker, at most 8 MiB.
3. Find the **Described by** analyzer beneath the samples. If several audio analyzers are on, choose this one.
4. Check **Recording to describe**. The most recent compatible upload is selected by default; explicitly choose another sample when needed.
5. Press **Analyze** once, then review the description, timbre, accent, language, pitch, pace and voice prompt. The selected recording is sent to fal for this request.
6. For an original generated voice, enable [fo-elevenlabs](../fo-elevenlabs/) and its key. Choose **Voice** from the Voice samples add control, review the analysis-derived **Voice prompt**, generate auditions and explicitly keep the one you want.

An uploaded recording is local inspiration until you request analysis. A designed preview or generated speech is not silently chosen as the newest upload. If no compatible upload has provenance, choose a recording explicitly.

## Results and preservation

The endpoint returns text, which the plugin parses and validates as structured voice characteristics. The host applies only known fields and vocabulary values. Unknown traits stay blank or retain existing values; invalid JSON changes nothing.

These are audible descriptions, not speaker identification. The prompt describes general qualities for an original voice. Existing media, unrelated character fields and `voice.provider_bindings` remain unchanged. Only a separate **Use this voice → Keep** operation creates and adopts a persistent voice ID.

## Check the result and cost

After analysis, reopen the character and confirm the new descriptions persisted. Generate a short ElevenLabs audition only if you want to test the next step; analysis and voice generation spend on different providers.

Check Usage for the analysis receipt. fal billing is used when accessible; otherwise the dollar amount can be unknown rather than free. A malformed JSON result can still incur a charge. The plugin does not automatically retry paid requests.

Descriptions follow the app language; machine pitch/pace tokens remain stable. This adapter accepts WAV/MP3, not an MP4 video container: extract a suitable audio reference first. [fal audio-understanding API](https://fal.ai/models/fal-ai/audio-understanding/api).
