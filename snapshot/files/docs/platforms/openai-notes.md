---
title: "OpenAI: technical notes"
description: What the OpenAI API asks of an account, how its keys and requests work, how it takes and returns media, and how it reports cost.
slug: docs/platforms/openai-notes
sidebar:
  hidden: true
lastUpdated: 2026-09-15
---

These notes gather what OpenAI documents about its API, for anyone comparing platforms or building on FilmOpen. The steps for getting a key are on [OpenAI](/docs/platforms/openai/). The *Sources* list at the end gives the day each page was read, 14 or 15 September 2026.
- **Console facts.** What OpenAI's console showed on 15 September 2026, while an account was opened and a key created, is marked *(console)*.
- **"Not documented"** means OpenAI's pages say nothing about it.
- **Help centre.** Its articles cannot be fetched by a script. Six were read in a browser on 15 September; the facts from the others come from search excerpts.

## Account and money

- **Sign-in:** an e-mail address, or a Google, Microsoft or Apple account. An account opened with a social login cannot switch to a password later ([sign-in methods](https://help.openai.com/en/articles/4936824-can-i-change-how-i-log-into-my-account-authentication-method)). Signing up with an e-mail address asked only for a code sent to it, with no password, name or birthday. The account then had an organisation named *Personal* and a *Default project* (console).
- **Two-factor sign-in:** managed from ChatGPT's Settings → Security or from the API platform, with an authenticator app, push notifications or a text message. It applies to both, and an organisation cannot enforce it ([multi-factor authentication](https://help.openai.com/en/articles/7967234-enabling-or-disabling-multi-factor-authentication-mfa)). The platform's Organization settings → Security holds a workload identity provider, an IP allowlist, mutual TLS and a domain allowlist instead (console).
- **Phone:** a code by SMS or, where available, WhatsApp. It is needed only before an account's first API key, not to open the account ([phone verification](https://help.openai.com/en/articles/8983040-what-does-phone-verification-look-like)). Sign-up did not ask for one (console).
- **Organisation verification:** OpenAI may ask for it before some models or features. It can be business verification, identity verification with a government-issued ID and a selfie if asked, or both, and a person can verify only one organisation ([organisation verification](https://help.openai.com/en/articles/10910291-api-organization-verification)). GPT Image models may ask for it before first use ([image generation](https://developers.openai.com/api/docs/guides/image-generation)). Organization settings → General offers it, as an individual or a business, for protected models (console).
- **Where it is offered:** [OpenAI's supported countries](https://developers.openai.com/api/docs/supported-countries). A request from anywhere else gets 403 ([error codes](https://developers.openai.com/api/docs/guides/error-codes)).
- **Billing:** prepaid credits, from $5, with $10 filled in. Credits expire after a year and are not refunded, apart from narrow exceptions such as billing errors. An account's trust tier sets the most credit it can hold ([prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing)). The Billing page says API credits are separate from ChatGPT (console).
  - **A first purchase** follows *Add payment details*: an amount, then *Use auto-reload*, which is on by default, then a confirmation. A failed first payment adds no credit, and a balance can take a few minutes to update ([prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing)).
  - **A new account's** Billing page offered *Add payment details*: a purchase for oneself or for a business, then a card or Apple Pay (console).
  - **An account with a card** has *Buy credits*. It opens *Add to credit balance*: an amount, with $10 filled in, within a range the window shows, and the card to charge (console).
- **Fees and tax:** OpenAI's billing pages mention no fee for buying credit. Its fees exclude taxes, which OpenAI charges as the law requires ([Services Agreement](https://cdn.openai.com/osa/openai-services-agreement.pdf), §6.3), and billing details can carry a tax or VAT ID ([tax and VAT IDs](https://help.openai.com/en/articles/9038389-updating-billing-information-tax-id-and-vat-id)).
- **Auto-recharge:** *Use auto-reload* is on by default at the first purchase. It takes a threshold, a balance to restore to, and an optional monthly reload limit, which caps automatic purchases, not API usage. A reload is at least $5, and the trust tier sets the most ([prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing)). The console calls it *Auto-reload credits*, changed with *Manage auto-reload* (console).
- **Usage tiers:** Tier 1 comes after $5 paid and allows up to $100 of usage a month; Tier 2 comes after $50 and allows up to $500 ([rate limits](https://developers.openai.com/api/docs/guides/rate-limits)).
- **Hard limits:** an organisation or a project can have a monthly spend limit, and once it is reached requests are refused with 429. Notification thresholds only warn ([spend limits](https://developers.openai.com/api/docs/guides/spend-limits)).
  - For an organisation, the limit is set on its Limits page ([usage and spend limits](https://help.openai.com/en/articles/6614457-troubleshooting-api-usage-and-spend-limits)). The Billing page links to it as *Usage limits* (console).
  - For a project, it is set under the project's Limits ([managing projects](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform)).
  - The prepaid balance is not an instant cut-off: usage is counted with a delay, so a balance can go negative, and the difference comes off the next purchase ([prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing)).
- **Usage and invoices:** a usage dashboard shows usage, and its figures may lag; how long is not documented ([usage dashboard](https://help.openai.com/en/articles/10478918-api-usage-dashboard)). Invoices and receipts are under Billing → Billing history ([invoices](https://help.openai.com/en/articles/6640792), [receipts](https://help.openai.com/en/articles/9039756)).
- **Problems seen:** a new account's Billing page said "Failed to load credit balance". Adding a card to it failed at once with "Oops! We couldn't add this payment method, please report this issue if it persists.", and no charge reached the card's bank (console). Since 11 September 2026, developers have reported failing cards, and payments that did not become credit ([community thread](https://community.openai.com/t/adding-new-payment-method-broken-on-web-at-platform-api/1396741)).

## Keys

- **Where:** the project's [API Keys page](https://platform.openai.com/api-keys), whose *Project API Keys* tab lists the project's keys (console). A key belongs to a project, and every organisation has a *Default project* that cannot be deleted ([managing projects](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform)). *User API Keys* are marked Legacy, and Organization settings → General can disable them for the whole organisation (console).
- **Creating one** (console):
  - **Owned by:** *You*, for a key that is disabled if its user is removed from the organisation or project, or a *Service account*.
  - **Name:** optional.
  - **Project:** the project the key belongs to.
  - **Expiration:** required: 1 day, 7 days, 30 days, Never or Custom. *Create secret key* stays disabled until one is chosen. OpenAI's changelog of 10 September 2026 added expiration dates for project keys, and a maximum key lifetime an administrator can set for the organisation or a project ([changelog](https://developers.openai.com/api/docs/changelog)).
  - **Permissions:** All, Restricted (none, read or write per resource) or Read only ([key permissions](https://help.openai.com/en/articles/8867743-assign-api-key-permissions)). An *All* key's permissions read "Read and write API resources" (console).
- **Keys created by API:** a service account's key takes an optional `expires_in_seconds` and reports `expires_at` (the official Node library, [pull request 2618](https://github.com/openai/openai-node/pull/2618), merged 5 September 2026).
- **What you copy:** the secret key, shown only when it is created, in *Save your key* ([finding your key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key); console).
- **The list** (console): Name, Status, Tracking ID, Secret Key, Created, Expires, Last used, Created by, Permissions and Monthly spend, with buttons to edit and delete each key.
- **Not documented:** the key's format, and whether a key is made at sign-up. A new account's Home lists *Create an API key* as its first step (console).
- **Checking a key:** `GET https://api.openai.com/v1/models` lists the models the key can use. OpenAI does not say whether it costs anything ([API reference](https://developers.openai.com/api/reference/overview)).

## Calling the API

- **Base URL and headers:** `https://api.openai.com/v1`, with `Authorization: Bearer <key>`. `OpenAI-Organization` and `OpenAI-Project` are needed only by someone in several organisations, or with a legacy user key. All request headers together must stay under 64 KiB ([API reference](https://developers.openai.com/api/reference/overview)).
- **Regional hosts:** `us.`, `eu.`, `au.`, `ca.`, `jp.`, `in.`, `sg.`, `kr.`, `gb.` and `ae.api.openai.com`, for a project created in that region. Processing stays in the region only in the US, the EU and the UAE ([your data](https://developers.openai.com/api/docs/guides/your-data)).
- **Text:** `POST /v1/responses`. With `stream: true` the answer arrives as server-sent events such as `response.output_text.delta`, `response.completed` and `error` ([streaming](https://developers.openai.com/api/docs/guides/streaming-responses)).
- **Long jobs:** `background: true`, then poll `GET /v1/responses/{id}` or cancel with `POST /v1/responses/{id}/cancel`. A project's webhooks follow Standard Webhooks and are retried for up to 72 hours ([background mode](https://developers.openai.com/api/docs/guides/background), [webhooks](https://developers.openai.com/api/docs/guides/webhooks)).
- **Rate limits:** reported in the `x-ratelimit-limit-*`, `x-ratelimit-remaining-*` and `x-ratelimit-reset-*` headers, for requests, tokens and project tokens, and in `Retry-After` ([rate limits](https://developers.openai.com/api/docs/guides/rate-limits)).
- **Errors a key check can meet** ([error codes](https://developers.openai.com/api/docs/guides/error-codes)):
  - **401:** a wrong, revoked or wrong-organisation key, or an IP address that is not allowed;
  - **403:** an unsupported country;
  - **429:** a rate limit, `slow_down`, `credit_balance_exhausted`, a spend limit (`organization_spend_limit_exceeded`, `project_spend_limit_exceeded`), or the usage limit OpenAI assigns, such as Tier 1's $100 a month (`organization_usage_limit_exceeded`).

  Billing errors may still say `insufficient_quota` ([429 errors](https://help.openai.com/en/articles/5955604-how-can-i-solve-429-too-many-requests-errors)).
- **Idempotency keys:** not documented for these requests.
- **SDKs:** official ones exist for JavaScript and TypeScript, Python, .NET, Java, Go and Ruby. There is none for Dart, so FilmOpen calls the HTTP API ([libraries](https://developers.openai.com/api/docs/libraries)).

## The models FilmOpen uses

**GPT-5.6 Sol** (writing) and **GPT-5.6 Terra** (structured text) share these capabilities:
- a 1,050,000-token context and up to 128,000 output tokens;
- reasoning effort from none to max;
- structured outputs;
- the Responses, Chat Completions and Batch endpoints ([Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)).

Their prices, per million tokens ([pricing](https://developers.openai.com/api/docs/pricing)):

| Model | Input / output | Above 272K input tokens | Cache writes |
|---|---|---|---|
| GPT-5.6 Sol | $4 / $20 | $8 / $30 | $5 |
| GPT-5.6 Terra | $2 / $12 | $4 / $18 | $2.50 |

**GPT Image 2.5**, Sunburst and Flare, generates and edits images.
- **Quality:** from low to max.
- **Sizes:** 1024×1024, 1536×1024 or 1024×1536, or a custom size in multiples of 16. The limits are 3840 px on an edge and 8,294,400 pixels in all; above 2560×1440 is experimental ([image generation](https://developers.openai.com/api/docs/guides/image-generation)).
- **Edits:** up to 16 reference images ([edit reference](https://developers.openai.com/api/reference/resources/images/methods/edit)).
- **Prices:** per million tokens, $5 text in, $8 image in and $30 image out ([pricing](https://developers.openai.com/api/docs/pricing)).

**GPT-Live-Transcribe** transcribes live over the Realtime WebSocket, `wss://api.openai.com/v1/realtime?intent=transcription` ([realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)).
- **Input:** 24 kHz 16-bit mono PCM, or G.711 μ-law or A-law.
- **Output:** text as you speak, with no timestamps or speaker labels.
- **Price:** $0.017 per minute.
- **Sessions:** at most 60 minutes ([realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)).

## Media in

- **Image edits** take files as multipart (`image[]`), or references by `image_url` or `file_id`. A mask matches the first image, stays under 50 MB and has an alpha channel ([image generation](https://developers.openai.com/api/docs/guides/image-generation)).
- **The Responses API** takes images as `input_image`: an https URL, a base64 data URL or a `file_id`. It accepts PNG, JPEG, WEBP or a still GIF, up to 512 MB and 1,500 images in a request ([images and vision](https://developers.openai.com/api/docs/guides/images-vision)).
- **What a URL given as input must satisfy** (redirects, HEAD requests, content type): not documented.
- **Uploads:** the Files API takes up to 512 MB per file and 2.5 TB per project, with an optional expiry. The Uploads API assembles up to 8 GB from parts ([files](https://developers.openai.com/api/reference/resources/files/methods/create), [uploads](https://developers.openai.com/api/reference/resources/uploads/methods/create)). Every upload needs the key; OpenAI documents no upload link that works without it.

## Media out

- **Images** come back inside the response as base64 (`data[].b64_json`): PNG by default, or JPEG or WEBP, with optional compression and a transparent background. Streaming sends up to three partial images first ([image generation](https://developers.openai.com/api/docs/guides/image-generation)).
- **Transcripts** arrive on the same WebSocket as `conversation.item.input_audio_transcription.delta` and `.completed` events ([realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)).
- **Writing results straight to your own storage:** images always come back inside the response. Not documented for the other endpoints.
- **What OpenAI keeps:** responses for 30 days unless `store` is false, and abuse-monitoring logs for 30 days. The image endpoint keeps nothing, and so does file transcription (`/v1/audio/transcriptions`); realtime sessions, live transcription among them, keep abuse-monitoring logs for 30 days. API data is not used for training unless you opt in ([your data](https://developers.openai.com/api/docs/guides/your-data)).

## Usage and cost

- **Each response reports its usage:** `input_tokens` (with `cached_tokens`), `output_tokens` (with `reasoning_tokens`, which are billed as output) and `total_tokens` ([reasoning](https://developers.openai.com/api/docs/guides/reasoning)).
- **The Usage and Costs APIs** need an admin key. Usage comes by the minute, hour or day; costs by the day, grouped by project, line item or key ([costs](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs)). How late they report is not documented.
- **Cut-off responses:** a response cut off at its output limit still bills its input and reasoning tokens ([reasoning](https://developers.openai.com/api/docs/guides/reasoning)).
- **Not documented:** whether a failed request, a request moderation refuses, or a cancelled background response is billed.

## Open questions

- Is the key check, `GET /v1/models`, always free?
- Are failed, refused or cancelled requests billed?
- How late do the Usage and Costs APIs report?
- Can a key's monthly spend be capped? The key list shows each key's *Monthly spend*.
- What follows *Continue* in *Add to credit balance*, for an account that already has a card?

## Sources

Read on 14 September 2026:
- **Getting started and prices:** [API reference](https://developers.openai.com/api/reference/overview), [quick start](https://developers.openai.com/api/docs/quickstart), [pricing](https://developers.openai.com/api/docs/pricing)
- **Limits and errors:** [rate limits](https://developers.openai.com/api/docs/guides/rate-limits), [spend limits](https://developers.openai.com/api/docs/guides/spend-limits), [error codes](https://developers.openai.com/api/docs/guides/error-codes), [supported countries](https://developers.openai.com/api/docs/supported-countries)
- **Models:** [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [image generation](https://developers.openai.com/api/docs/guides/image-generation), [images and vision](https://developers.openai.com/api/docs/guides/images-vision), [realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription), [realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)
- **Guides:** [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), [background mode](https://developers.openai.com/api/docs/guides/background), [webhooks](https://developers.openai.com/api/docs/guides/webhooks), [reasoning](https://developers.openai.com/api/docs/guides/reasoning), [your data](https://developers.openai.com/api/docs/guides/your-data), [libraries](https://developers.openai.com/api/docs/libraries)
- **Reference pages:** [files](https://developers.openai.com/api/reference/resources/files/methods/create), [uploads](https://developers.openai.com/api/reference/resources/uploads/methods/create), [image edits](https://developers.openai.com/api/reference/resources/images/methods/edit), [costs](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs)
- **Terms:** [Services Agreement](https://cdn.openai.com/osa/openai-services-agreement.pdf), read from its PDF
- **Help centre (search excerpts):** [usage dashboard](https://help.openai.com/en/articles/10478918-api-usage-dashboard), [invoices](https://help.openai.com/en/articles/6640792), [receipts](https://help.openai.com/en/articles/9039756), [usage and spend limits](https://help.openai.com/en/articles/6614457-troubleshooting-api-usage-and-spend-limits), [managing projects](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform), [finding your key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key), [key permissions](https://help.openai.com/en/articles/8867743-assign-api-key-permissions), [429 errors](https://help.openai.com/en/articles/5955604-how-can-i-solve-429-too-many-requests-errors)

Read on 15 September 2026:
- **Console:** *Create an account* and *Check your inbox* (auth.openai.com); Home; Organization settings (General, Security); Billing (Overview, *Add payment details*, *Add to credit balance*); API keys (*Create new secret key*, *Save your key*, the list)
- **Help centre, in a browser:** [prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing), [phone verification](https://help.openai.com/en/articles/8983040-what-does-phone-verification-look-like), [multi-factor authentication](https://help.openai.com/en/articles/7967234-enabling-or-disabling-multi-factor-authentication-mfa), [sign-in methods](https://help.openai.com/en/articles/4936824-can-i-change-how-i-log-into-my-account-authentication-method), [tax and VAT IDs](https://help.openai.com/en/articles/9038389-updating-billing-information-tax-id-and-vat-id), [organisation verification](https://help.openai.com/en/articles/10910291-api-organization-verification)
- **Changes:** [changelog](https://developers.openai.com/api/docs/changelog), [openai-node pull request 2618](https://github.com/openai/openai-node/pull/2618)
- **Community:** [adding a payment method, September 2026](https://community.openai.com/t/adding-new-payment-method-broken-on-web-at-platform-api/1396741)
