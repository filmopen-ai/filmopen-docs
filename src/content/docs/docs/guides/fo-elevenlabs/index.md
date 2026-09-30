---
title: "ElevenLabs voices"
description: "Design an original voice, retain its provider voice ID, and generate speech WAV files."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-elevenlabs/index.md
sidebar:
  label: fo-elevenlabs
  order: 1
---

Plugin types: [Voice Generation](../plugin-types/voice-generation/), [Speech Synthesis](../plugin-types/speech-synthesis/).

Design an original voice with Voice Design v3, save a selected provider voice, then generate speech with Eleven v3. One plugin owns these operations and its ElevenLabs key. FilmOpen owns consent, credentials, media insertion and Usage.

## Set up and design a voice

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-elevenlabs** in **Settings → Plugins**.
2. In **Settings → Provider keys**, save and verify the ElevenLabs plugin's key. Its slot belongs to `fo-elevenlabs`, not to a separate connector.
3. Open a character you can edit. Under **Voice samples**, use the add control and choose **Voice**. This opens **Generate voice**.
4. Enter a **Voice prompt** describing tone, apparent age, accent and pace. You may enter **Audition text**; leave it empty to use the plugin's localized default sample.
5. Press **Generate voice** once. Wait for the previews, then open each audio tile to listen.
6. Under **Previews to audition**, choose **Use this voice** for the candidate you want. In **Keep this voice?**, enter **Name of the voice** and press **Keep**. This saves a voice to your provider account and consumes a voice slot.

Uploading a WAV/MP3 through **Upload** stores a local reference sample. It does not clone that voice, create an ElevenLabs voice ID or send it to ElevenLabs automatically. For editable audio-to-description, use [fo-fal-voice](../fo-fal-voice/) first.

## Generate speech and check the result

1. After keeping a voice, use the add control under **Voice samples** and choose **Render**.
2. Select the Eleven v3 speech model. Enter **Words to say**, then press **Render** once.
3. Open and play the completed WAV. Confirm it speaks your words in the voice you kept.
4. Reopen the character and verify its kept voice remains available for another speech request. Check Usage for both design and speech; preview generation, keeping a voice and speech are distinct operations.

The design description accepts 20–1000 characters, audition text 100–1000 when provided, and spoken text 1–5000. Design returns up to three MP3 previews; speech returns a 24 kHz PCM WAV. Stability accepts 0, 0.5 or 1. Voice cloning, streaming and deterministic seeds are not implemented.

## Media and provider voice identity

A preview ID is not a persistent voice ID. FilmOpen retains each sample's `voice_binding`, containing `provider`, `generated_voice_id` for a preview and `voice_id` once kept. The character's `voice.provider_bindings` maps a provider to the persistent ID speech should use; `voice.active_reference` points to the associated sample. These are the canonical fields used by the current app, not the earlier lab's reference-metadata proposal.

An uploaded recording has no invented voice binding. Copying a WAV or project does not grant another account access to a custom provider voice. Removing a local sample does not delete the provider's voice or silently switch the voice used for speech.

If the provider kept the voice but the local write failed, **Retry write** saves the acknowledged choice without creating another voice. If the provider response was lost, inspect your provider voices before trying to keep it again.

## Usage and errors

ElevenLabs credits and characters are not an exact USD invoice. Unknown dollar cost must remain unknown in Usage; it is not zero spend. Generating previews or speech may be chargeable even when a result cannot be used.

Resolve missing keys, permissions and host audio capability before submitting. No paid request is automatically repeated. A cancelled wait does not prove the provider cancelled processing.

The UI and plugin labels have English/Spanish translations; the language of spoken text is a separate choice. The package's sharing proposal enables no live relay and does not expose voice management or credentials.

[Voice Design API](https://elevenlabs.io/docs/api-reference/text-to-voice/design), [save a voice](https://elevenlabs.io/docs/api-reference/text-to-voice/create).
