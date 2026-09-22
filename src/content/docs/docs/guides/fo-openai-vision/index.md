---
title: "Character photo analysis with GPT-6 Astra"
description: "Turn a reference photo into editable character attributes and a generation prompt."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-vision/index.md
sidebar:
  label: fo-openai-vision
  order: 1
---

Plugin types: [Character Analysis](../plugin-types/character-analysis/).


**fo-openai-vision** analyzes a character reference. The character controls and media bridge described here are currently a **temporary plugin-lab integration**, not yet a feature of the permanent Flutter app.

## Use

1. Enable fo-openai-vision and fo-openai. Save your OpenAI key in the existing app key box and allow fo-openai to use it.
2. Create or open a character in Edit mode and upload a reference in its photo or Voice section.
3. Under the reference, choose the available analysis model and press **Analyze**.
4. Review the populated fields and prompt, then use **Render** for an image or **Generate voice** for ElevenLabs Voice Design.

The adapter sends the photo with the supported character-field schema to GPT-6 Astra using Responses and strict structured output. It extracts visible face, hair, eyes, complexion, clothing, accessories and posture, plus prompt.positive. GPT Image 2.5 can then render the resulting prompt. The text analyzer and image generator are separate models.

Only the most recent upload is analyzed. Generated images and voice previews do not replace that source. Older references without upload provenance need a fresh upload in the lab. The input limit is 8 MiB: PNG/JPEG for images, WAV/MP3 for audio. Choose a short, clear recording with one speaker. Clicking Analyze sends this reference to the selected provider; uploading alone does not.

## Fields and preservation

The supplied schema covers the relevant character fields, not the entire private project. Unknown traits remain blank or keep existing values. The analyzer does not infer identity, ethnicity, biography, personality or exact physical measurements. Descriptions are approximate and editable. Invalid JSON is refused as a whole, and the host applies only known paths and voice enum values. Edits made during the request are preserved instead of being overwritten.

Existing references, voice IDs and unrelated character fields remain intact. A description does not create an engine voice ID: ElevenLabs Generate voice returns previews, and **Use this voice** separately saves the selected candidate and its reusable ID. See [ElevenLabs voices](../fo-elevenlabs/).

## Cost, language and integration

Each explicit analysis can incur a provider charge. GPT-6 usage records measured input/output tokens with an estimated dollar cost from published rates. fal receipt-scoped billing is used when available; otherwise the dollar amount is unknown, not free. Failed JSON can still incur charges. There are no automatic paid retries.

Labels and errors use English/Spanish ARB files. Descriptive text and prompts follow the app language; machine enum values remain stable. Logs contain operation/model/receipt/error metadata, not keys, media data or generated descriptions.

The package offers `describeReference` and proposed `x.referenceAnalysis` metadata. Production integration needs authorized media inputs, model discovery, durable jobs and extended usage accounting. The existing commentary-oriented entity analyze hook is not silently changed. Source, portable tests and milestone 1-10 are in [filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins). No sharing relay is enabled.

API references: [GPT-6 Astra model](https://developers.openai.com/api/docs/models/gpt-6-astra) and [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Verified 2026-09-21.

The temporary render popup includes extracted negative constraints as visible, editable "Avoid" instructions within the prompt. This is natural-language guidance; it does not claim a separate negative-conditioning feature in GPT Image or Z-Image.
