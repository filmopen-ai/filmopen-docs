---
title: "OpenRouter: technical notes"
description: What OpenRouter asks of an account, how its keys and requests work, how it takes and returns media, and how it reports cost.
slug: docs/platforms/openrouter-notes
sidebar:
  hidden: true
lastUpdated: 2026-09-15
---

These notes gather what OpenRouter documents about its API, for anyone comparing platforms or building on FilmOpen. The steps for getting a key are on [OpenRouter](/docs/platforms/openrouter/). Every page in *Sources* was read on 15 September 2026.
- **Console facts.** What OpenRouter's site showed on 15 September 2026, while an account was opened with Google, is marked *(console)*.
- **"Not documented"** means OpenRouter's pages say nothing about it.

## Account and money

- **Sign-in:** GitHub, Google or MetaMask, or an e-mail address and a password, with an optional first and last name (console). Signing up with Google led to *Legal consent*, accepting the Terms of Service, Privacy Policy and Model Terms, then to first-run steps asking whether the account is for an individual or an organisation (console).
- **Who can sign up:** people aged 18 or over ([terms](https://openrouter.ai/terms), §2). OpenRouter publishes no list of countries, but some model providers don't let people in certain countries or regions use their models (terms, §5.7).
- **Phone, identity checks and two-factor sign-in:** not documented. Signing up with Google asked for no phone or identity check (console).
- **Workspaces:** a new account's first workspace, made at sign-up, keeps its API keys, usage tracking and billing together (console).
- **Billing:** prepaid credits in US dollars, from $5 to $25,000 a purchase. Unused credits can be refunded if asked within 24 hours of a purchase; fees and crypto payments are never refunded (terms, §4.1). OpenRouter may expire credits 365 days after purchase (terms, §4.2).
- **Fees:** 5.5% on card purchases, at least $0.80, and 5% in crypto ([FAQ](https://openrouter.ai/docs/faq)).
- **Payment methods:** cards, AliPay and USDC ([FAQ](https://openrouter.ai/docs/faq)). A first-run step asks for a card number and an amount (console).
- **Tax:** not documented.
- **Auto-recharge:** optional. When buying credits, a user can have OpenRouter charge the chosen payment method whenever credits fall below a threshold the user sets, which the terms call *Auto Recharge* (§4.2). Whether it is on when first offered: not documented.
- **Limits:**
  - **Per key:** a spending limit in US dollars, which can reset daily, weekly or monthly ([creating a key](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key)).
  - **When requests stop:** a request gets 402 once the account's balance is below zero, or a key's remaining limit reaches zero ([limits](https://openrouter.ai/docs/api_reference/limits)).
  - **Guardrails** add budgets and rules on models and providers, for keys, members or workspaces ([guardrails](https://openrouter.ai/docs/guides/features/guardrails)).
  - **A cap on the whole account:** not documented.
- **Usage:** OpenRouter's Activity page lists requests by model, provider and key ([FAQ](https://openrouter.ai/docs/faq)).

## Keys

- **Where:** the API keys page, where a key gets a name and, optionally, a credit limit ([authentication](https://openrouter.ai/docs/api_reference/authentication)).
- **Made at sign-up:** yes. The first-run step *Your workspace is ready* shows the first workspace's API key, saying it is the only time the full key will be shown (console).
  - **In its field** the key is shortened.
  - **In its *Make your first request* code sample** the key is whole, so a screen capture of that step captures the key (console).
- **What you copy:** the key, which starts `sk-or-v1-` (console).
- **Kinds:** API keys, which call the models, and management keys, which create and manage API keys but can't call the completion endpoints ([management keys](https://openrouter.ai/docs/guides/overview/auth/management-api-keys)).
- **Keys created by API** need a management key ([creating a key](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key)).
  - **The request:** `name`, `limit` in US dollars, `limit_reset` (`daily`, `weekly`, `monthly` or none), `include_byok_in_limit`, and `expires_at` (an ISO 8601 time in UTC, with seconds).
  - **The key itself** is returned only in that response.
- **Checking a key:** `GET https://openrouter.ai/api/v1/key` returns the key's label, limit, remaining limit, usage and expiry ([current key](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key)), and OpenRouter's limits page names it as the way to check what a key has left ([limits](https://openrouter.ai/docs/api_reference/limits)). Whether it costs anything: not documented.
- **The balance by API:** `GET /api/v1/credits` needs a management key ([credits](https://openrouter.ai/docs/api/api-reference/credits/get-remaining-credits)).
- **Leaks:** OpenRouter uses GitHub secret scanning to find its keys in public code, and e-mails the owner ([authentication](https://openrouter.ai/docs/api_reference/authentication)).
- **Not documented:** scopes for API keys.

## Calling the API

- **Base URL and headers:** `https://openrouter.ai/api/v1`, with `Authorization: Bearer <key>`. Optional `HTTP-Referer` and title headers credit an app in OpenRouter's rankings ([authentication](https://openrouter.ai/docs/api_reference/authentication), [API overview](https://openrouter.ai/docs/api_reference/overview)).
- **Text:** `POST /api/v1/chat/completions`, in the shape of OpenAI's Chat Completions. Parameters a model doesn't support are ignored ([API overview](https://openrouter.ai/docs/api_reference/overview)). A stateless Responses API is at `/api/v1/responses` ([Responses API](https://openrouter.ai/docs/api_reference/responses/overview)).
- **Streaming** ([streaming](https://openrouter.ai/docs/api_reference/streaming)):
  - **The stream:** server-sent events. Comment lines such as `: OPENROUTER PROCESSING` can be ignored, and usage comes in the last chunk.
  - **An error after the stream has started** arrives as an event with `finish_reason: "error"`.
  - **Cancelling a stream** stops processing and billing only with providers that support it, such as OpenAI and Anthropic; not with others, such as Google and Amazon Bedrock.
- **Routing:**
  - **Choosing a provider.** OpenRouter picks one for each request, weighing price and skipping providers with recent outages. The `provider` object can order, allow or ignore providers ([provider selection](https://openrouter.ai/docs/guides/routing/provider-selection)).
  - **Fallbacks.** A `models` list falls back to other models; the call is billed at the model that answered ([model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)).
- **Rate limits** ([limits](https://openrouter.ai/docs/api_reference/limits)):
  - **Free models** allow 20 requests a minute and 50 a day, or 1,000 a day once $10 of credits has been bought.
  - **Capacity** is governed globally, so more accounts or keys don't raise the limits.
- **Errors** ([errors](https://openrouter.ai/docs/api_reference/errors-and-debugging)):
  - **400:** bad parameters;
  - **401:** an invalid or disabled key;
  - **402:** no credits left;
  - **403:** moderation or a guardrail;
  - **408:** a timeout;
  - **429:** rate limited;
  - **502:** the model is down or answered badly;
  - **503:** no provider meets the request's routing requirements.
- **Idempotency keys:** not documented.
- **SDKs:** TypeScript, Python and Go. There is none for Dart, so FilmOpen calls the HTTP API ([SDKs](https://openrouter.ai/docs/client-sdks/overview)).

## The models FilmOpen uses

Prices per million tokens, from OpenRouter's public endpoints API, one address per model, such as [Claude Opus 5's](https://openrouter.ai/api/v1/models/anthropic/claude-opus-5/endpoints):

| Model | Input / output | Cache read / write | Longer prompts | Context, tokens |
|---|---|---|---|---|
| Claude Opus 5 | $5 / $25 | $0.50 / $6.25 | — | 1,000,000 |
| Claude Sonnet 5 | $2 / $10 | $0.20 / $2.50 | — | 1,000,000 |
| GPT-5.6 Sol | $2 / $10, marked 50% off | $0.20 / $2.50 | 272,000 or more: $4 / $15 | 1,050,000 |
| GPT-5.6 Terra | $2 / $12 | $0.20 / $2.50 | 272,000 or more: $4 / $18 | 1,050,000 |
| Gemini 3.1 Pro | $2 / $12 | $0.20 / $0.375 | Above 200,000: $4 / $18 | 1,048,576 |
| Gemini 3.8 Flash | $0.75 / $3.75, marked 50% off | $0.075 / about $0.04 | — | 1,048,576 |

- **Providers:** the table gives each model's maker's own endpoint (endpoints API).
  - **Anthropic's models** are also served by Claude Platform on AWS, Amazon Bedrock, Azure and Google Vertex; regional endpoints charge 10% more.
  - **OpenAI's models** are also served by Azure and Amazon Bedrock. GPT-5.6 Sol's discount is on OpenAI's own endpoints only, so Sol costs more there: $4.40 / $22 on Bedrock, $5 / $30 on Azure and $5.50 / $33 on Azure's US and EU endpoints. GPT-5.6 Terra costs OpenAI's own $2 / $12 on Azure, and 10% more on Azure's US and EU endpoints and on Bedrock.
  - **Gemini** is served by Google AI Studio and Vertex, each with a cheaper *flex* endpoint and a dearer *priority* one.
- **Discounts:** OpenRouter's [discounted models](https://openrouter.ai/collections/discounted-models) list GPT-5.6 Sol and Gemini 3.8 Flash at 50% off, with no end date.
- **Prompt caching:** writing to Anthropic's cache costs 1.25 times the input price for five minutes, or twice for an hour, and reading costs a tenth ([prompt caching](https://openrouter.ai/docs/guides/best-practices/prompt-caching)).
- **Images:** the catalogue's Nano Banana models are on OpenRouter too, made through `POST /api/v1/images` ([images API](https://openrouter.ai/docs/api/api-reference/images/generate-an-image)). FilmOpen's first version makes images through fal.

## Media in

- **Images** go in a message as an `image_url` part: an https URL or a base64 data URL, in PNG, JPEG, WebP or GIF ([image understanding](https://openrouter.ai/docs/guides/overview/multimodal/image-understanding)). Size limits: not documented.
- **PDFs** go as a `file` part, by URL or as base64 ([PDFs](https://openrouter.ai/docs/guides/overview/multimodal/pdfs)).
- **Audio** goes as base64 in an `input_audio` part; a URL is not accepted ([audio](https://openrouter.ai/docs/guides/overview/multimodal/audio)).
- **The images API's reference images:** up to 16, as base64 or http(s) URLs; a request that is too large gets 413 ([images API](https://openrouter.ai/docs/api/api-reference/images/generate-an-image)).
- **What a URL given as input must satisfy:** not documented.

## Media out

- **Images** from `/api/v1/images` come back as base64 with their media type ([images API](https://openrouter.ai/docs/api/api-reference/images/generate-an-image)), and a failed generation is not billed ([image generation](https://openrouter.ai/docs/guides/overview/multimodal/image-generation)).
- **What OpenRouter keeps:**
  - **Logging:** prompts and completions are not logged by default ([FAQ](https://openrouter.ai/docs/faq)), and a user can opt in ([data collection](https://openrouter.ai/docs/guides/privacy/data-collection)).
  - **Training:** OpenRouter does not use inputs or outputs to train models ([privacy](https://openrouter.ai/privacy)).
  - **Zero data retention:** requests can be limited to providers that keep nothing ([zero data retention](https://openrouter.ai/docs/guides/features/zdr)).
- **Writing results straight to your own storage:** not documented.

## Usage and cost

- **Every response reports `usage`**, including its `cost` in credits, without being asked ([usage accounting](https://openrouter.ai/docs/cookbook/administration/usage-accounting)).
- **Per key:** `GET /api/v1/key` reports a key's usage, including daily, weekly and monthly totals ([current key](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key)).
- **Requests that fail or are cancelled:**
  - **Prompts.** A provider may still charge for processing a prompt that produced nothing ([errors](https://openrouter.ai/docs/api_reference/errors-and-debugging)).
  - **Fallbacks.** Only the model that answered is billed ([model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)).
  - **Cancelled streams.** Cancelling stops billing only with providers that support it ([streaming](https://openrouter.ai/docs/api_reference/streaming)).

## Open questions

- When does the 50% discount on GPT-5.6 Sol and Gemini 3.8 Flash end?
- Does checking a key with `GET /api/v1/key` cost anything?
- Is *Auto Recharge* on or off when it is first offered, and what does it ask for?
- Can the API keys page set a limit's reset period and an expiry, as the API can?
- Does OpenRouter add tax to a purchase of credits?
- What do its files and logging pages add to how media is taken and kept? They were not read.

## Sources

Read on 15 September 2026:
- **Console:** the sign-up page; *Legal consent*; the first-run steps *Welcome to OpenRouter* and *Your workspace is ready*
- **Terms and policies:** [terms](https://openrouter.ai/terms), last updated 31 August 2026; [privacy](https://openrouter.ai/privacy); [FAQ](https://openrouter.ai/docs/faq)
- **Keys and limits:** [authentication](https://openrouter.ai/docs/api_reference/authentication), [limits](https://openrouter.ai/docs/api_reference/limits), [creating a key](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key), [current key](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key), [credits](https://openrouter.ai/docs/api/api-reference/credits/get-remaining-credits), [management keys](https://openrouter.ai/docs/guides/overview/auth/management-api-keys), [guardrails](https://openrouter.ai/docs/guides/features/guardrails)
- **Calling the API:** [API overview](https://openrouter.ai/docs/api_reference/overview), [Responses API](https://openrouter.ai/docs/api_reference/responses/overview), [streaming](https://openrouter.ai/docs/api_reference/streaming), [errors](https://openrouter.ai/docs/api_reference/errors-and-debugging), [provider selection](https://openrouter.ai/docs/guides/routing/provider-selection), [model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks), [SDKs](https://openrouter.ai/docs/client-sdks/overview)
- **Models:** the endpoints API for each model, such as [Claude Opus 5's](https://openrouter.ai/api/v1/models/anthropic/claude-opus-5/endpoints); [discounted models](https://openrouter.ai/collections/discounted-models); [prompt caching](https://openrouter.ai/docs/guides/best-practices/prompt-caching)
- **Media:** [images API](https://openrouter.ai/docs/api/api-reference/images/generate-an-image), [image generation](https://openrouter.ai/docs/guides/overview/multimodal/image-generation), [image understanding](https://openrouter.ai/docs/guides/overview/multimodal/image-understanding), [PDFs](https://openrouter.ai/docs/guides/overview/multimodal/pdfs), [audio](https://openrouter.ai/docs/guides/overview/multimodal/audio)
- **Data and usage:** [data collection](https://openrouter.ai/docs/guides/privacy/data-collection), [zero data retention](https://openrouter.ai/docs/guides/features/zdr), [usage accounting](https://openrouter.ai/docs/cookbook/administration/usage-accounting)
