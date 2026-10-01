---
title: "xAI: technical notes"
description: What the xAI API asks of an account, how its keys and requests work, how its live speech to text takes and returns audio, and how it reports cost.
slug: docs/platforms/xai-notes
sidebar:
  hidden: true
lastUpdated: 2026-09-18
---

These notes gather what xAI documents about its API, for anyone comparing platforms or building on FilmOpen. The steps for getting a key are on [xAI (Grok)](/docs/platforms/xai/). Every page in *Sources* was read on 18 September 2026.
- **Console facts.** What xAI's console showed on 18 September 2026, while an account was opened, credit bought and a key created, is marked *(console)*.
- **"Not documented"** means xAI's pages say nothing about it.
- **The name.** xAI's documentation and console now say *SpaceXAI*. The API's host, the console's address, the keys' prefix and the environment variable keep `x.ai` and `xai`.

## Account and money

- **Sign-in:** a Google, X, Apple or GitHub account, or an e-mail address (console). Signing up by e-mail asked for a code sent to it; no phone or identity check was asked for (console).
- **The team:** sign-up asks for a *Team name* and what best describes you: Hobbyist, Student, Engineer, Business or Other. Keys, credit and billing belong to the team (console).
- **Prepaid credits or monthly invoices:** credits are bought in advance and usage is taken from them. Monthly invoiced billing is off by default: with the default invoiced limit of $0, requests are rejected once the credits are used up ([billing](https://docs.x.ai/console/billing)).
- **Buying credit:** charged when you buy it ([billing FAQ](https://docs.x.ai/docs/resources/faq-api/billing)). The first purchase offers *Explore* (free), *Prototype* (from $5) and *Build* (from $50); each only fills in the amount, which can be changed. Payment is by card (Visa, Mastercard, Discover) or Cash App Pay, with a country and ZIP code, and the invoice calls it a *Single Purchase* (console).
- **Auto top-up:** a threshold, a top-up amount of at least $5, and an optional monthly maximum. xAI recommends it and it can be turned off at any time ([billing](https://docs.x.ai/console/billing)). At the first purchase it is on, below $5, for the amount being bought, with no monthly maximum (console). An account can top up at most 200 times in 24 hours ([billing](https://docs.x.ai/console/billing)). After a first payment by card with auto top-up turned off, the Billing page listed no payment method (console).
- **Refunds:** none for prepaid credit, unless the law requires one ([billing FAQ](https://docs.x.ai/docs/resources/faq-api/billing)). **Expiry of credit:** not documented.
- **Tax and fees:** fees are exclusive of taxes, and the customer pays any card-processing fee ([enterprise terms](https://x.ai/legal/terms-of-service-enterprise), *Fees, Payment, and Taxes*).
- **Promo codes:** the Billing page has *Redeem promo code* (console).

## Keys

- **Where:** the team's [API keys page](https://console.x.ai/team/default/api-keys). The console's `team/default/…` addresses lead to the signed-in team's own pages (console). *Management Keys*, under the team's settings, are a separate kind of key for the management API, not for models ([management API](https://docs.x.ai/developers/rest-api-reference/management/auth)).
- **Creating one** (console):
  - **Name:** up to 127 characters.
  - **Models:** *All models*, or a choice among the Chat, Image and Video groups. No speech model is listed.
  - **Endpoints:** *All endpoints*, or a choice among Batch, Chat, Compact, Documents, Files, Image, Models, Sample, Tokenize, Video and Voice.
  - **Tokens per minute** and **Requests per minute:** no limit unless set.
  - **Expiry:** *No expiry*, or a date.
- **The same limits by API:** a key's ACLs are `api-key:endpoint:<name>` and `api-key:model:<name>`, with `*` for all. The management API creates keys and rotates them; after a rotation the old secret keeps working for 24 hours by default, or up to 7 days ([management API](https://docs.x.ai/developers/rest-api-reference/management/auth)).
- **What you copy:** a key starting `xai-`, shown once in *All set, here is your API key* with *Copy API Key* (console). Afterwards only a redacted form is shown, `xai-…` and the last four characters ([management API](https://docs.x.ai/developers/rest-api-reference/management/auth)).
- **The list** (console): Name, Key (redacted), Spend (30d), Last used and Owner, with a menu on each row.
- **Made at sign-up?** No: a new team's dashboard offers *Create your first API Key* (console).
- **Checking a key:** `GET https://api.x.ai/v1/api-key` returns the key's own record: its ACLs, whether the key or the team is blocked or disabled, its ID, name, team and redacted form ([API reference](https://docs.x.ai/developers/rest-api-reference/inference/other)). On 18 September 2026 it answered a wrong key with **400** (`invalid-argument`) and a request with no key with **401** (`unauthenticated:no-credentials`). Whether it costs anything is not documented.

## Calling the API

- **Base URL and header:** `https://api.x.ai/v1`, with `Authorization: Bearer <key>` ([quickstart](https://docs.x.ai/developers/quickstart)).
- **Regional hosts:** `us.api.x.ai` handles requests in the United States, and serves none of the image, video or voice APIs; the global host, `api.x.ai`, is the one for voice ([regional endpoints](https://docs.x.ai/developers/regions)).
- **Keys in a browser:** xAI's voice pages say never to put a key in client-side code, and to reach the WebSocket through your own server ([speech to text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)). FilmOpen's desktop app sends your own key from the operating system's credential store, as it does OpenAI's.
- **Rate limits:** by tier, which rises with what a team has paid xAI since 1 January 2026 and never goes down: Tier 1 from $50, Tier 2 from $250, Tier 3 from $1,000, Tier 4 from $5,000. Voice endpoints are limited by requests per second and sessions at once: speech to text allows 10 requests a second, and 100 sessions at Tier 0 or 200 at Tier 1 ([rate limits](https://docs.x.ai/developers/rate-limits)).
- **SDKs:** there is none for Dart, so FilmOpen speaks the WebSocket directly.

## The models FilmOpen uses

**grok-voice-transcribe-2.0** transcribes live over a WebSocket, `wss://api.x.ai/v1/stt`. xAI calls it its best transcription model; without `model`, the WebSocket uses grok-voice-transcribe-1.0 ([speech to text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)).
- **Set in the address:** `model`, `sample_rate` (8,000 to 48,000 Hz, 16,000 by default), `encoding` (`pcm`, `mulaw`, `alaw` or `opus`), `interim_results`, `endpointing` (0 to 5,000 ms of silence ending an utterance, 400 by default), `language`, and options for several channels, speakers, filler words, key terms and turn detection. Nothing is sent to set the session up.
- **Languages:** 25, among them English, Spanish, Portuguese, French, German, Hindi, Japanese and Korean.
- **Price:** $0.20 an hour of audio while streaming ([pricing](https://docs.x.ai/developers/pricing)).
- **Sessions:** how long one may last, or stay open without audio, is not documented.

## Media in

- **Live audio:** raw audio in binary WebSocket frames, sent at the pace it is spoken, for example in 100 ms chunks. PCM is signed 16-bit little-endian; Opus is one raw packet a frame ([speech to text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)). FilmOpen sends 24 kHz mono PCM in 100 ms frames.
- **Control messages:** `{"type": "finalize"}` ends the utterance in progress at once; `{"type": "audio.done"}` says the audio has ended.
- **A recording, not live:** `POST https://api.x.ai/v1/stt` takes a file of up to 500 MB, in WAV, MP3, OGG, Opus, FLAC, AAC, MP4, M4A or MKV, or raw PCM, μ-law or A-law with its format given. FilmOpen doesn't use it.

## Media out

- **Live transcripts** arrive on the same WebSocket ([speech to text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)):
  - `transcript.created` when the session is ready;
  - `transcript.partial`, with `is_final` and `speech_final`: interim words that can still change, a chunk locked after about three seconds, and the end of an utterance;
  - `transcript.done`, the whole transcript, after which the connection closes;
  - `error`, with a message.
- **A recording's transcript** comes back with the detected language, the duration, a time for each word and, when asked, speakers and channels.
- **What xAI keeps:** requests and responses, encrypted, for 30 days, for auditing suspected abuse. xAI doesn't train on API inputs or outputs without permission. Zero Data Retention is a team setting that stores neither; it turns off some features, and every response says whether it is on in its `x-zero-data-retention` header ([security FAQ](https://docs.x.ai/developers/faq/security)).

## Usage and cost

- **In the console:** *Usage* in the sidebar, and each key's *Spend (30d)* on the API keys page (console).
- **When a cost is counted:** at the time of the request ([billing FAQ](https://docs.x.ai/docs/resources/faq-api/billing)).
- **Speech to text:** $0.20 an hour live and $0.10 an hour for a recording ([pricing](https://docs.x.ai/developers/pricing)). Whether a live session is billed for the audio sent or for the time connected is not documented.

## Open questions

- Is a live session billed for the audio sent, or for the time it stays open?
- How long can a live session last, and how long can it stay open without audio?
- What does `finalize` answer when no utterance is in progress?
- Is the key check, `GET /v1/api-key`, always free?
- Does a wrong key always get 400 from the key check, and never 401?

## Sources

Read on 18 September 2026:
- **xAI:** [speech to text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text), [pricing](https://docs.x.ai/developers/pricing), [billing](https://docs.x.ai/console/billing), [billing FAQ](https://docs.x.ai/docs/resources/faq-api/billing), [rate limits](https://docs.x.ai/developers/rate-limits), [regional endpoints](https://docs.x.ai/developers/regions), [quickstart](https://docs.x.ai/developers/quickstart), [API reference: the key's record](https://docs.x.ai/developers/rest-api-reference/inference/other), [management API](https://docs.x.ai/developers/rest-api-reference/management/auth), [security FAQ](https://docs.x.ai/developers/faq/security); [enterprise terms](https://x.ai/legal/terms-of-service-enterprise), read in a browser
- **The console:** its sign-up page, team creation, first purchase, dashboard, Billing page and API keys page, with the *Create API Key* form, while an account was opened, credit bought and a key made
- **The key check's answers:** `GET https://api.x.ai/v1/api-key` with a stand-in key and with none
