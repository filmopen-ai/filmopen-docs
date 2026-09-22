---
title: "Voice reference analysis on fal"
description: "Describe a recording as structured voice characteristics and an original voice-design prompt."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-voice/index.md
sidebar:
  label: fo-fal-voice
  order: 1
---

Plugin types: [Voice Analysis](../plugin-types/voice-analysis/).


**fo-fal-voice** analyzes a character reference. The character controls and media bridge described here are currently a **temporary plugin-lab integration**, not yet a feature of the permanent Flutter app.

## Use

1. Enable fo-fal-voice and fo-fal, then save your fal key in the plugin provider box. Enable fo-elevenlabs and its key if you want to generate a voice from the result.
2. Create or open a character in Edit mode and upload a reference in its photo or Voice section.
3. Under the reference, choose the available analysis model and press **Analyze**.
4. Review the populated fields and prompt, then use **Render** for an image or **Generate voice** for ElevenLabs Voice Design.

The adapter sends the most recent uploaded audio to fal-ai/audio-understanding. It requests voice.description, timbre, audible accent, language, pitch, pace and voice.prompt. The endpoint returns a string, so JSON is validated locally before any character update. These are audible descriptions, not speaker identification. The prompt describes general qualities for a new original voice; no cloning is performed.

Only the most recent upload is analyzed. Generated images and voice previews do not replace that source. Older references without upload provenance need a fresh upload in the lab. The input limit is 8 MiB: PNG/JPEG for images, WAV/MP3 for audio. Choose a short, clear recording with one speaker. Clicking Analyze sends this reference to the selected provider; uploading alone does not.

## Fields and preservation

The supplied schema covers the relevant character fields, not the entire private project. Unknown traits remain blank or keep existing values. The analyzer does not infer identity, ethnicity, biography, personality or exact physical measurements. Descriptions are approximate and editable. Invalid JSON is refused as a whole, and the host applies only known paths and voice enum values. Edits made during the request are preserved instead of being overwritten.

Existing references, voice IDs and unrelated character fields remain intact. A description does not create an engine voice ID: ElevenLabs Generate voice returns previews, and **Use this voice** separately saves the selected candidate and its reusable ID. See [ElevenLabs voices](../fo-elevenlabs/).

## Cost, language and integration

Each explicit analysis can incur a provider charge. GPT-6 usage records measured input/output tokens with an estimated dollar cost from published rates. fal receipt-scoped billing is used when available; otherwise the dollar amount is unknown, not free. Failed JSON can still incur charges. There are no automatic paid retries.

Labels and errors use English/Spanish ARB files. Descriptive text and prompts follow the app language; machine enum values remain stable. Logs contain operation/model/receipt/error metadata, not keys, media data or generated descriptions.

The package offers `describeReference` and proposed `x.referenceAnalysis` metadata. Production integration needs authorized media inputs, model discovery, durable jobs and extended usage accounting. The existing commentary-oriented entity analyze hook is not silently changed. Source, portable tests and milestone 1-10 are in [filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins). No sharing relay is enabled.

API references: [fal audio-understanding API](https://fal.ai/models/fal-ai/audio-understanding/api). Verified 2026-09-21.
