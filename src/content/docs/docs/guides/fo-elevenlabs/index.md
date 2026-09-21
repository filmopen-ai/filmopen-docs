---
title: "ElevenLabs voices"
description: "Design an original voice, retain its provider voice ID, and generate speech WAV files."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-elevenlabs/index.md
sidebar:
  label: fo-elevenlabs
  order: 1
---

**fo-elevenlabs** is one package for ElevenLabs Voice Design v3 and Eleven v3 speech. It owns its API key and model functions; its HTTP helpers are internal. FilmOpen owns credential storage, consent, network access, logging and media imports.

The character Voice controls and audio/usage extensions described here are currently a **temporary plugin-lab integration**. The permanent application UI is being developed separately. Installing the package in an older app does not supply the required audio output capability.

## Set up and use

1. Enable **ElevenLabs voices** in Settings → Plugins.
2. In Settings → Provider keys, save your key in the ElevenLabs plugin's box. FilmOpen verifies it and stores it encrypted on this device. The plugin slot is `fo-elevenlabs:elevenlabs`.
3. In a character's **Edit → Voice** section, upload an optional WAV/MP3 reference and enter a **Voice prompt** describing the new voice.
4. Choose **Generate voice**. Voice Design v3 returns audition previews. Listen, select a candidate, and choose **Use this voice** to save its persistent ElevenLabs voice ID.
5. Enter **Spoken text for the WAV** and choose **Generate speech WAV**. FilmOpen calls Eleven v3 using that saved ID and imports the 24 kHz WAV into the project's normal media directory.

Uploaded recordings remain local inspiration and have no invented voice ID. They are not automatically sent to ElevenLabs. A generated preview's temporary ID is distinct from the persistent ID created by **Use this voice**. Saving consumes an account voice slot; generating previews and speech consumes credits.

## Controls and limits

| Operation | Inputs | Output |
|---|---|---|
| Voice Design v3 | Voice description: 20–1000 characters; preview text: 100–1000, with a localized default | Up to three MP3 audition previews |
| Save voice | Selected candidate and voice name | Persistent provider voice ID |
| Eleven v3 speech | Saved voice ID; spoken text: 1–5000 characters | One 24 kHz WAV |

The plugin also accepts v3 stability values 0, 0.5 or 1; the temporary UI uses 0.5. Uploaded audio follows the same project media importer as images. No voice cloning, streaming or deterministic seed is implemented in this package. For optional audio-to-description, use the separate [fal voice analyzer](../fo-fal-voice/); its structured result fills voice traits and the design prompt.

## Audio and identity

An image reference needs its media file. A designed voice also needs the provider's persistent voice ID for subsequent speech. The lab keeps ordinary `voice.refs` strings and proposes `voice.referenceMetadata[reference]` containing `provider` and `voiceId`, with a separate `activeReference`. Candidate IDs are named `generatedVoiceId` until saved. This is a host integration proposal, not a canonical format change.

Voice IDs are provider/account scoped. Copying a project or WAV does not grant another account access to the custom voice. Removing a local recording must not imply deleting a voice from the provider account.

## Usage and errors

FilmOpen records characters, available provider credit counts and request receipts in its existing Usage ledger. **Unknown dollar cost is not zero cost.** ElevenLabs subscriptions and discounts mean a credit count is not an exact USD debit. The temporary app displays characters/credits and marks dollar cost unavailable; permanent accounting must also make unknown spend clear in totals.

Missing keys, grants or required host audio capability fail before a request. Quota, endpoint permission and malformed audio errors use localized messages and FilmOpen logging. Paid calls are never retried automatically. If a response is lost, check the ElevenLabs account before repeating it: a request may already have consumed credits or created a voice. A known saved ID is retained even if the optional local save cache fails.

## Can audio become a descriptive voice prompt?

No documented ElevenLabs endpoint that turns a recording into a descriptive voice prompt was found in the checked API. Voice Design v3 can use reference audio directly, but that is a different workflow and is not used by this plugin. [Voice Design API](https://elevenlabs.io/docs/api-reference/text-to-voice/design).

A future audio-understanding model could produce editable broad traits such as pitch, texture, accent and pacing, then pass the user's revised description to Voice Design. For example: “A warm, mature narrator with a low resonant register, gently textured timbre and unhurried delivery.” This does not require sending a named person's recording to the voice generator.

## Languages and future sharing

Plugin UI/error tokens live in `l10n/en.arb` and `l10n/es.arb`. Temporary character controls use the app's English/Spanish dictionaries. The speech content's language is separate from the interface language.

The manifest proposes only speech generation for a future sharing relay. The proposal enables nothing. Voice management, keys and internal API functions remain private; account-owned voice resolution, access, pricing and output validation belong to the future host/relay implementation.

Source: [plugin package](https://github.com/filmopen-ai/filmopen-plugins/tree/filmopen-plugins-milestone-1-1/fo-elevenlabs). Provider references checked 21 September 2026: [Voice Design](https://elevenlabs.io/docs/api-reference/text-to-voice/design), [save a voice](https://elevenlabs.io/docs/api-reference/text-to-voice/create), [speech with timestamps](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps).
