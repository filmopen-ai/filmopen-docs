---
title: "fal: technical notes"
description: What fal asks of an account, how its keys and requests work, how it takes and returns media, and how it reports cost.
slug: docs/platforms/fal-notes
sidebar:
  hidden: true
lastUpdated: 2026-09-15
---

These notes gather what fal documents about its API, for anyone comparing platforms or building on FilmOpen. The steps for getting a key are on [fal](/docs/platforms/fal/). Every page in *Sources* was read on 15 September 2026.
- **Console facts.** What fal's site showed on 15 September 2026, while an account was opened with Google, is marked *(console)*.
- **"Not documented"** means fal's pages say nothing about it.

## Account and money

- **Sign-in:** GitHub, Google, Microsoft or single sign-on, with no sign-up by e-mail address and password. Continuing accepts fal's Terms of Service and Privacy Policy ([sign-in page](https://fal.ai/login)).
  - **One account per way of signing in.** Each way makes a separate account, except that Google and GitHub with the same e-mail address share one; single sign-on is always separate ([accounts and identity](https://fal.ai/docs/documentation/setting-up/accounts-and-identity)). Whether a Microsoft sign-in joins them: not documented.
  - **After sign-in** fal opened its dashboard, which shows the balance as *Credits* (console).
  - **The dashboard's *Getting started* list:** create an account, add a payment method (*Set up billing*), add credits, and generate a first image or video (console).
- **Two-factor sign-in, phone and identity checks:** not documented. Signing in with Google asked for none (console).
- **Teams:** a new user gets a personal account. A team has its own keys, apps and billing, and its members have roles ([accounts and identity](https://fal.ai/docs/documentation/setting-up/accounts-and-identity), [teams](https://fal.ai/docs/documentation/setting-up/teams)).
- **Billing:** prepaid credits, drawn down as they are used ([pricing](https://fal.ai/docs/documentation/model-apis/pricing)).
- **The terms on money** ([terms](https://fal.ai/legal/terms-of-service)):
  - payment by card or ACH, in US dollars;
  - prices exclude taxes;
  - credits expire 365 days after purchase, and free or promotional credits after 90;
  - credits are non-refundable.
- **What is charged:** outputs made successfully, and time in the queue is free ([pricing](https://fal.ai/docs/documentation/model-apis/pricing)). Errors on fal's side (5xx) are never charged, cold starts are not charged, and a client error such as a 422 may be, when a runner had already spent GPU time on the request ([FAQ](https://fal.ai/docs/documentation/model-apis/faq)).
- **Smallest purchase, fees, automatic top-up and spending limits:** not documented.
- **Settings** (console):
  - **The Settings menu:** Account, Notification Settings, Usage, Credits & Tiers, Billing, API Keys, Webhooks, Activity, Errors and Request History.
  - **The settings pages' side list** adds Address, Concurrency Limits, Invoices, Log Drains, Log Privacy and Training History.
- **Concurrency** ([concurrency limits](https://fal.ai/docs/documentation/model-apis/concurrency-limits)):
  - a new account runs 2 requests at a time;
  - the limit rises with the invoices paid over the last four weeks, to 40 without talking to sales;
  - requests over it wait in the queue, and fal may set limits of its own on busy models.

## Keys

- **Where:** Settings → *API Keys* (console), at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys).
- **Creating one** (console):
  - *Add key* opens *New Key*, which asks for a **Scope** and a **Description**.
  - fal describes the API scope as for running models and calling inference endpoints, unable to manage keys, billing, usage or compute, and recommends it for most uses.
  - The window then shows *Your new key*, with *Copy Key*, and suggests storing the key in the environment, such as GitHub Secrets or `.env.local`.
- **Scopes** ([authentication](https://fal.ai/docs/documentation/setting-up/authentication), [Platform API authentication](https://fal.ai/docs/api-reference/platform-apis/authentication)):
  - **API** reaches the models and most Platform APIs;
  - **ADMIN** adds managing apps, and the Platform APIs that need it.
- **Shown once:** a key must be copied when it is created ([authentication](https://fal.ai/docs/documentation/setting-up/authentication)).
- **Format:** a key made through the Platform API is `key_id:key_secret` ([creating a key](https://fal.ai/docs/platform-apis/v1/keys/create)). For a key made on the keys page: not documented.
- **A team's keys** belong to the team; only its admins create or delete them ([teams](https://fal.ai/docs/documentation/setting-up/teams)).
- **A key made at sign-up:** none. A new account's API Keys page lists no key, under the columns Description, Key, Created At, Tags and Scope (console).
- **Expiry:** not documented.
- **Checking a key:** `GET https://api.fal.ai/v1/models/pricing?endpoint_id=…` needs a key and returns prices ([pricing API](https://fal.ai/docs/platform-apis/v1/models/pricing)).
  - **Wrong key:** 401.
  - **Key without the scope:** 403 ([Platform API authentication](https://fal.ai/docs/api-reference/platform-apis/authentication)).
  - **Whether the call costs anything:** not documented.

## Calling the API

- **Header:** `Authorization: Key <key>`; fal's SDKs read `FAL_KEY` ([authentication](https://fal.ai/docs/documentation/setting-up/authentication)).
- **The queue** ([queue](https://fal.ai/docs/documentation/model-apis/inference/queue)):
  - `POST https://queue.fal.run/<model_id>` returns a `request_id`, with URLs for its status and result;
  - the status is `IN_QUEUE`, `IN_PROGRESS` or `COMPLETED`;
  - `PUT …/requests/<request_id>/cancel` cancels a request;
  - fal itself retries server errors, timeouts and rate limits in the queue.
- **Webhooks:** `?fal_webhook=<url>`. Deliveries are retried for about an hour, and signed with ED25519 against keys fal publishes ([webhooks](https://fal.ai/docs/documentation/model-apis/inference/webhooks)).
- **Synchronous calls:** `https://fal.run/<model_id>`, without the queue ([synchronous](https://fal.ai/docs/documentation/model-apis/inference/synchronous)).
- **Realtime:** WebSocket endpoints for a few models ([real-time](https://fal.ai/docs/documentation/model-apis/inference/real-time)).
- **Errors** ([request errors](https://fal.ai/docs/documentation/model-apis/request-errors)):
  - **The error itself:** a body with `detail` and `error_type`, the type also in the `X-Fal-Error-Type` header.
  - **Common codes:** timeouts are 504, a runner's failures 502 or 503, and a client's cancellation 499.
- **Idempotency keys:** not documented.
- **SDKs:** fal documents a Dart client, `fal_client` ([Dart client](https://fal.ai/docs/api-reference/client-libraries/dart), [pub.dev](https://pub.dev/packages/fal_client)).

## The models FilmOpen uses

Prices from each model's page:

| Model | Endpoint | Price |
|---|---|---|
| Nano Banana Pro | `fal-ai/nano-banana-pro`, and `/edit` | $0.15 an image at 1K or 2K, $0.30 at 4K |
| Nano Banana 2 | `fal-ai/nano-banana-2`, and `/edit` | $0.08 an image at 1K; 0.75 times at 0.5K, 1.5 times at 2K, twice at 4K; $0.002 more with high thinking |
| GPT Image 2.5 | `openai/gpt-image-2.5/sunburst/…` and `/flare/…` | Per million tokens: text $5 in, $1.25 cached, $10 out; image $8 in, $2 cached, $30 out |
| HiDream-O1-Image | `fal-ai/hidream-o1-image` | $0.01 a megapixel |
| Z-Image-Turbo | `fal-ai/z-image/turbo` | $0.005 a megapixel |
| Qwen-Image-Edit-2511 | `fal-ai/qwen-image-edit-2511` | $0.03 a megapixel |
| FLUX.2 [klein] 4B | `fal-ai/flux-2/klein/4b/edit` | $0.01 a megapixel |
| Veo 3.1 | `fal-ai/veo3.1/lite/…` | $0.05 a second at 720p with sound, $0.03 without |
| Kling 3.0 | `fal-ai/kling-video/v3/standard/…` | $0.084 a second without sound, $0.126 with |
| Seedance 2.5 | `bytedance/seedance-2.5/…` | About $0.22 a second at 480p, fal's estimate |
| MiniMax H3 | `minimax/h3-max/…`, `minimax/h3-max-turbo/…` | $0.05 a second at 480p; Turbo $0.025 |
| LTX-2.5 | `lightricks/ltx-2.5/…/fast` | $0.09 a second at 720p |
| Kling Avatar 2.0 | `fal-ai/kling-video/ai-avatar/v2/standard` | $0.0562 a second |
| Eleven v3 | `fal-ai/elevenlabs/tts/eleven-v3`, `…/text-to-dialogue/eleven-v3` | $0.10 per 1,000 characters |

- **Web search** adds $0.015 to a Nano Banana request.
- **Voice design:** `fal-ai/elevenlabs/text-to-voice/design/eleven-v3` makes a voice from a description, at $0.10 per 1,000 characters the voice performs ([voice design](https://fal.ai/models/fal-ai/elevenlabs/text-to-voice/design/eleven-v3)), and returns previews and the saved voice's `voice_id` ([its API](https://fal.ai/models/fal-ai/elevenlabs/text-to-voice/design/eleven-v3/api)).
  - **Using the voice.** The dialogue endpoint takes a voice's name or id; the speech endpoint's `voice` mentions no id.
  - **Not documented:** where fal keeps a saved voice, and for how long.

## Media in

- **Input files** ([fal CDN](https://fal.ai/docs/documentation/model-apis/fal-cdn)):
  - public URLs that serve the file directly;
  - links presigned on S3, Google Cloud Storage or R2;
  - base64 data URIs, which fal advises against beyond a few kilobytes.
- **Uploads** go through fal's SDKs to its storage and need the key; large files go up in 10 MB chunks ([fal CDN](https://fal.ai/docs/documentation/model-apis/fal-cdn)).
- **Not documented:** a REST upload endpoint, size limits, and whether an input URL may redirect.

## Media out

- **Results** are kept on fal's CDN, under `fal.media`, and are public by default, so downloading one needs no key ([fal CDN](https://fal.ai/docs/documentation/model-apis/fal-cdn), [file access controls](https://fal.ai/docs/documentation/model-apis/file-access-controls)).
- **For how long:** at least 7 days by default ([FAQ](https://fal.ai/docs/documentation/model-apis/faq)).
  - **For one request:** its `X-Fal-Object-Lifecycle-Preference` header sets its own expiry ([media expiration](https://fal.ai/docs/documentation/model-apis/media-expiration)).
  - **For the account:** its storage settings set a default ([storage](https://fal.ai/docs/api-reference/platform-apis/for-storage)).
- **Private results:** a request can make its files private, which are then read with a token or a signed link ([file access controls](https://fal.ai/docs/documentation/model-apis/file-access-controls)).
- **Request payloads** are kept 30 days by default; `X-Fal-Store-IO: 0` keeps none ([media expiration](https://fal.ai/docs/documentation/model-apis/media-expiration)).
- **Writing results straight to your own storage:** not documented.

## Usage and cost

- **A finished request** reports its inference time; no cost field is documented ([queue](https://fal.ai/docs/documentation/model-apis/inference/queue)).
- **The usage API:** `GET https://api.fal.ai/v1/models/usage` needs an ADMIN key, and gives quantities, unit prices and costs by endpoint, key and time ([usage API](https://fal.ai/docs/platform-apis/v1/models/usage)). How late it reports: not documented.
- **Charged or not:** errors on fal's side are never charged, and a 422 may be when a runner had already spent GPU time ([FAQ](https://fal.ai/docs/documentation/model-apis/faq)); time in the queue is free ([pricing](https://fal.ai/docs/documentation/model-apis/pricing)). Cancelled requests: not documented.

## Open questions

- What is the smallest purchase, and does fal offer automatic top-up or a spending limit?
- Does the pricing read that checks a key cost anything?
- Whose usage does a realtime token book to?
- Does fal train on customers' inputs and outputs? Its data processing addendum was not read.
- Where is a designed voice kept, and does the speech endpoint take its id?

## Sources

Read on 15 September 2026:
- **Console:** the sign-in page, the dashboard, the Settings menu, the API Keys page, and its *New Key* and *Your new key* windows
- **Terms:** [terms of service](https://fal.ai/legal/terms-of-service), last updated 8 September 2026, read in a browser
- **Accounts and keys:** [sign-in page](https://fal.ai/login), [authentication](https://fal.ai/docs/documentation/setting-up/authentication), [accounts and identity](https://fal.ai/docs/documentation/setting-up/accounts-and-identity), [teams](https://fal.ai/docs/documentation/setting-up/teams), [Platform API authentication](https://fal.ai/docs/api-reference/platform-apis/authentication), [creating a key](https://fal.ai/docs/platform-apis/v1/keys/create), [pricing API](https://fal.ai/docs/platform-apis/v1/models/pricing)
- **Money and limits:** [pricing](https://fal.ai/docs/documentation/model-apis/pricing), [FAQ](https://fal.ai/docs/documentation/model-apis/faq), [concurrency limits](https://fal.ai/docs/documentation/model-apis/concurrency-limits), [usage API](https://fal.ai/docs/platform-apis/v1/models/usage)
- **Calling the API:** [queue](https://fal.ai/docs/documentation/model-apis/inference/queue), [synchronous](https://fal.ai/docs/documentation/model-apis/inference/synchronous), [webhooks](https://fal.ai/docs/documentation/model-apis/inference/webhooks), [real-time](https://fal.ai/docs/documentation/model-apis/inference/real-time), [request errors](https://fal.ai/docs/documentation/model-apis/request-errors), [Dart client](https://fal.ai/docs/api-reference/client-libraries/dart), [pub.dev](https://pub.dev/packages/fal_client)
- **Media:** [fal CDN](https://fal.ai/docs/documentation/model-apis/fal-cdn), [media expiration](https://fal.ai/docs/documentation/model-apis/media-expiration), [file access controls](https://fal.ai/docs/documentation/model-apis/file-access-controls), [storage](https://fal.ai/docs/api-reference/platform-apis/for-storage)
- **Models:** [Nano Banana Pro](https://fal.ai/models/fal-ai/nano-banana-pro), [Nano Banana 2](https://fal.ai/models/fal-ai/nano-banana-2), [GPT Image 2.5](https://fal.ai/models/openai/gpt-image-2.5/sunburst/text-to-image), [HiDream-O1-Image](https://fal.ai/models/fal-ai/hidream-o1-image), [Z-Image-Turbo](https://fal.ai/models/fal-ai/z-image/turbo), [Qwen-Image-Edit-2511](https://fal.ai/models/fal-ai/qwen-image-edit-2511), [FLUX.2 klein 4B](https://fal.ai/models/fal-ai/flux-2/klein/4b/edit), [Veo 3.1 Lite](https://fal.ai/models/fal-ai/veo3.1/lite/image-to-video), [Kling 3.0](https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video), [Seedance 2.5](https://fal.ai/models/bytedance/seedance-2.5/image-to-video), [MiniMax H3 Max](https://fal.ai/models/minimax/h3-max/image-to-video), [H3 Max Turbo](https://fal.ai/models/minimax/h3-max-turbo/image-to-video), [LTX-2.5 Fast](https://fal.ai/models/lightricks/ltx-2.5/image-to-video/fast), [Kling Avatar 2.0](https://fal.ai/models/fal-ai/kling-video/ai-avatar/v2/standard), [Eleven v3](https://fal.ai/models/fal-ai/elevenlabs/tts/eleven-v3), [voice design](https://fal.ai/models/fal-ai/elevenlabs/text-to-voice/design/eleven-v3) and [its API](https://fal.ai/models/fal-ai/elevenlabs/text-to-voice/design/eleven-v3/api)
