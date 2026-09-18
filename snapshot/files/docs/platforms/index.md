---
title: AI platforms and API keys
description: The AI platforms FilmOpen works with, what their models cost, and what each asks for before you can use your own key.
slug: docs/platforms
sidebar:
  label: Overview
  order: 0
lastUpdated: 2026-09-15
---

FilmOpen reaches AI models on several platforms. With your own key, you open an account with a platform, add money there, create an API key, and add the key in FilmOpen under **Settings → Provider keys**. FilmOpen then sends your requests to that platform, and the platform bills you directly, at its own prices.

FilmOpen's first version works with three platforms: [OpenRouter](/docs/platforms/openrouter/) for writing and structured text, [fal](/docs/platforms/fal/) for images, video and voices, and [OpenAI](/docs/platforms/openai/) for live transcription. The others are listed here as pending, with what stands in their way.

:::note[Prices change]
Every price and minimum on these pages was checked on 14 or 15 September 2026. Platforms change them often, so each platform's own page links to its current pricing. Where a table says **Not published**, the platform's own pages don't say.
:::

## Supported now, and pending

**Supported in the first version:**
- **OpenRouter:** every language model, for writing and structured text.
- **fal:** images and video, and ElevenLabs' voices for now.
- **OpenAI:** live transcription, as you dictate.

**Pending.** These platforms are described below, but FilmOpen doesn't take their keys yet:
- **Anthropic, and Google's Gemini API:** their text models are reached through OpenRouter. Google's Veo and Nano Banana models are reached through fal.
- **Google Cloud Vertex AI:** its credential is a Google Cloud project, not a key you paste.
- **ElevenLabs:** its voices are reached through fal. Eleven Music waits for this platform, since nothing else reaches it.
- **Deepgram:** a lower-cost live transcription to add later.
- **Kling:** its API is sold in packages from $700; fal charges about the same per second, with no package.
- **BytePlus:** Seedance 2.5 needs USD 30 of credits that can't be withdrawn, and BytePlus isn't offered in the United States.
- **MiniMax:** its video model is reached through fal.
- **LTX:** its video model is reached through fal. Clips between two frames timed to your own audio wait for this platform, which alone makes them.
- **Replicate:** fal was chosen for images and video; Replicate deletes results after an hour and signs in only with GitHub.
- **ComfyUI and Hugging Face:** they run or download models on your own computer, which FilmOpen doesn't do yet.

## Directly from the maker, or through a marketplace

- **Directly:** OpenAI, Anthropic, Google, ElevenLabs, Deepgram, MiniMax and LTX sell their own models.
- **Through a marketplace:** fal and Replicate offer many makers' image, video and voice models from one account; OpenRouter does the same for text and image models.
  - **Price:** a marketplace often charges the maker's price, but not always; the tables below show where they differ.
  - **Delay:** a marketplace adds one more service between FilmOpen and the model.

## The platforms at a glance

| Platform | What FilmOpen uses it for | How you pay | To start |
|---|---|---|---|
| OpenRouter | Every language model: writing (Claude Opus 5, GPT-5.6 Sol, Gemini 3.1 Pro) and structured text (Claude Sonnet 5, GPT-5.6 Terra, Gemini 3.8 Flash) | Prepaid credits, plus 5.5% (at least $0.80) when you buy them by card | $5 |
| fal | Images and video from many makers, and ElevenLabs voices | Prepaid credits | Not published |
| OpenAI | Live transcription (GPT-Live-Transcribe); also writing, structured text and images, not used in the first version | Prepaid credits | $5 |
| Anthropic | Writing (Claude Opus 5), structured text (Claude Sonnet 5) | Prepaid credits | Not published |
| Google (Gemini API) | Writing (Gemini 3.1 Pro), structured text (Gemini 3.8 Flash), images (Nano Banana Pro, Nano Banana 2), video (Veo 3.1) | Prepaid by default, or billed monthly | $5 |
| Replicate | Video (Kling 3.0, Seedance 2.5, MiniMax H3, Veo 3.1, LTX-2.5 Fast) and Z-Image-Turbo images | Prepaid credit | Not published |
| ElevenLabs | Voices (Eleven v3), music (Eleven Music v2.5) | A plan (Free, or Starter at $6 a month) plus an optional prepaid balance | $5 of balance |
| Deepgram | Live transcription (Nova-3) | Prepaid credit, with $200 free for a new account | No minimum |
| MiniMax | Video (MiniMax H3) | Prepaid balance | Not published |
| LTX | Video (LTX-2.5), including clips between two frames timed to your own audio, which FilmOpen reaches only through LTX | Prepaid credits | $5 |
| Hugging Face | Downloading open models to run on your own computer | Free | — |

- **ElevenLabs music:** it can be used commercially from the Starter plan up.
- **Hugging Face:** none of the models FilmOpen downloads today needs a token; a token only raises download limits.

## Signing up

| Platform | Sign in with | What it checks | Where it is offered |
|---|---|---|---|
| OpenRouter | A GitHub, Google or MetaMask account, or an e-mail address and a password | You must be 18 or over; signing up with Google asked for nothing else | No country list; some model providers exclude certain countries or regions |
| fal | A GitHub, Google or Microsoft account, or single sign-on; there is no password sign-up | Not published; signing up with Google asked for no phone or identity check | No country list; its terms exclude places under US embargo |
| OpenAI | An e-mail address, or a Google, Microsoft or Apple account | A phone code before your first key, not to sign up. It may also ask for organisation verification (a business check, an identity check with an ID, or both) before the image models | [Supported countries](https://developers.openai.com/api/docs/supported-countries) |
| Anthropic | A Google account, or a sign-in link sent by e-mail | Not published | [Supported countries](https://www.anthropic.com/supported-countries) |
| Google (Gemini API) | A Google account | Billing details; in some countries, a tax ID | [Available regions](https://ai.google.dev/gemini-api/docs/available-regions) |
| Replicate | A GitHub account | Not published | No country list; its terms exclude places under US embargo |
| ElevenLabs | An e-mail address, or a Google or Apple account | Not published | Everywhere except sanctioned countries and regions |
| Deepgram | A GitHub or Google account, or an e-mail address | Not published | No country list; its terms follow US export and sanctions rules |
| MiniMax | Not published | Not published | Not published |
| LTX | Not published | Not published | Not published |
| Hugging Face | An e-mail address and a password | Not published | Not published |

## Also sold directly

These makers sell their models directly too, but set a higher bar to start:
- **Kling** sells Kling 3.0 and its avatar model in prepaid packages from $700 (5,000 units, valid 180 days). You sign in with an e-mail address, the same account as Kling's web app, and the API key is shown once. fal charges about the same per second with no package.
- **BytePlus** sells Seedance 2.5 once you hold USD 30 in credits, an AI Savings Plan or a resource pack, none of which can be withdrawn or cancelled. Its real-name verification is for organisations. It is offered in most countries, but not the United States. Replicate charges about the same per second.

## Your key

What you copy from each platform and paste into FilmOpen:

| Platform | What you copy | Shown again after you create it? | Made for you at sign-up? |
|---|---|---|---|
| OpenRouter | A key starting `sk-or-v1-` | No | Yes: your first workspace's key, shown once during sign-up |
| fal | A key with the API scope | No | No: a new account has no key until you add one |
| OpenAI | A secret key, with an expiry you choose when you create it | No | Not published |
| Anthropic | A key starting `sk-ant-`; choose one workspace for it when you create it | No | Not published |
| Google (Gemini API) | An API key | Not published | Yes, a default key once you accept the terms |
| Replicate | A token starting `r8_` | Not published | Yes, a default token |
| ElevenLabs | A key | Not published | Not published |
| Deepgram | A key | No | Not published (sign-up creates your first project) |
| MiniMax | The pay-as-you-go API key, not the Token Plan key | Not published | Not published |
| LTX | A key, with an expiry date you can change | No | Not published |
| Hugging Face | A token starting `hf_`; a read token is enough | Not published | Not published |
| Kling | An API key (older API versions use an Access Key and a Secret Key) | No | Not published |
| BytePlus | An API key | Not published | Not published |

## What the models cost

Prices are the platforms' standard rates in US dollars, before tax.

### Writing and structured text

Prices are per million tokens, input / output, for ordinary prompts. Longer prompts cost more: above 272,000 input tokens at OpenAI, and above 200,000 at Google.

| Model | From its maker | OpenRouter |
|---|---|---|
| Claude Opus 5 | Anthropic: $5 / $25 | $5 / $25 |
| Claude Sonnet 5 | Anthropic: $2 / $10 | $2 / $10 |
| GPT-5.6 Sol | OpenAI: $4 / $20 | $2 / $10, a discount OpenRouter lists without an end date |
| GPT-5.6 Terra | OpenAI: $2 / $12 | $2 / $12 |
| Gemini 3.1 Pro | Google: $2 / $12 | $2 / $12 |
| Gemini 3.8 Flash | Google: $0.75 / $3.75 until 31 December 2026, then $1.50 / $7.50 | $0.75 / $3.75 |

OpenAI, Anthropic and Google charge half for batch requests, which come back later rather than at once.

### Images priced per image

| Model | Google | fal | Replicate |
|---|---|---|---|
| Nano Banana Pro | $0.134 at 1K or 2K, $0.24 at 4K | $0.15, or $0.30 at 4K | — |
| Nano Banana 2 | From $0.045 (0.5K) to $0.151 (4K) | From $0.06 (0.5K), plus $0.002 with high thinking | — |
| Z-Image-Turbo | — | — | From $0.0025 (up to 0.5 megapixels) |

### Images priced per megapixel

| Model | fal |
|---|---|
| HiDream-O1-Image | $0.005 (Dev) or $0.01 |
| Z-Image-Turbo | $0.005 |
| Qwen-Image-Edit-2511 | $0.03 |
| FLUX.2 [klein] 4B | $0.01 |

### Images priced by tokens

Per million tokens.

| Model | Where | Input | Image output |
|---|---|---|---|
| GPT Image 2.5 | OpenAI, and fal at the same rates | $5 text, $8 image | $30 |
| Nano Banana Pro | OpenRouter | $2 | $120 |
| Nano Banana 2 | OpenRouter | $0.50 | $60 |

### Video

Per second of video. Each row compares the same tier on every platform.

| Model | Compared at | From its maker | fal | Replicate |
|---|---|---|---|---|
| Veo 3.1 | Lite, 720p, with sound | Google: $0.05 | $0.05 ($0.03 without sound) | $0.05 |
| Kling 3.0 | Standard, 720p, without sound | Kling: $0.084, in packages from $700 | $0.084 | $0.168 |
| Seedance 2.5 | 480p | BytePlus: about $0.103, after USD 30 to start | About $0.22 (fal's estimate) | $0.1028 |
| MiniMax H3 | H3 Max, 480p | MiniMax: $0.05 | $0.05 (H3 Max Turbo: $0.025) | — (H3 from $0.08 at 768p) |
| LTX-2.5 | Fast, 720p | LTX: $0.09 | $0.09 | $0.03 |
| Kling Avatar 2.0 | Standard | Kling: $0.056 | $0.0562 | — |

### Voices, music and transcription

| Model | From its maker | fal |
|---|---|---|
| Eleven v3 | ElevenLabs: $0.10 per 1,000 characters, once a plan's monthly allowance is used | $0.10 per 1,000 characters |
| Eleven Music v2.5 | ElevenLabs: $0.15 per minute, with a paid plan or a prepaid balance | — |
| GPT-Live-Transcribe | OpenAI: $0.017 per minute | — |
| Nova-3 | Deepgram: $0.0048 per minute while streaming (promotional; $0.0077 regular) | — |

## Before you pay

- **Credits are usually prepaid and not refunded, and many expire.**
  - After a year: OpenAI, Anthropic, Google, fal, Replicate, LTX, and ElevenLabs' balance. OpenRouter may also expire credits after a year, and fal's promotional credits expire after 90 days.
  - Kling's packages last 180 days.
  - Deepgram's credit does not expire.
  - OpenRouter refunds unused credits if you ask within 24 hours of buying them.
- **Extra charges.** Tax may be added at checkout, depending on where you live, and your card issuer may charge for purchases in US dollars.
- **Check auto-recharge when you add money.** OpenAI turns it on by default at your first purchase, and Deepgram turns it on too, adding $100 when your credit falls to $10. OpenRouter offers it as an option when you buy credits, and ElevenLabs leaves it off; the others don't say.
- **Set a spending limit where you can:**
  - OpenAI: per organisation or project.
  - Anthropic: per organisation or workspace.
  - OpenRouter: per key.
  - ElevenLabs: per key, plus a monthly cap.
  - Google: an experimental project cap in AI Studio, on top of the monthly cap Google sets for each billing tier.

## Sources

Read on 14 September 2026:
- **OpenAI:**
  - [pricing](https://developers.openai.com/api/docs/pricing), [supported countries](https://developers.openai.com/api/docs/supported-countries), [spend limits](https://developers.openai.com/api/docs/guides/spend-limits), [rate limits and tiers](https://developers.openai.com/api/docs/guides/rate-limits), [image generation](https://developers.openai.com/api/docs/guides/image-generation)
  - help centre (search excerpts): [prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing), [phone verification](https://help.openai.com/en/articles/8983040-what-does-phone-verification-look-like), [organisation verification](https://help.openai.com/en/articles/10910291-api-organization-verification), [sign-in methods](https://help.openai.com/en/articles/4936824-can-i-change-how-i-log-into-my-account-authentication-method), [finding your key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)
- **Anthropic:** [pricing](https://platform.claude.com/docs/en/about-claude/pricing), [supported countries](https://www.anthropic.com/supported-countries), [paying for API usage](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage), [signing in](https://support.claude.com/en/articles/13371040-log-in-to-your-console-account), [getting a key](https://platform.claude.com/docs/en/get-api-key), [authentication](https://platform.claude.com/docs/en/manage-claude/authentication), [rate and spend limits](https://platform.claude.com/docs/en/api/rate-limits)
- **Google:** [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing), [billing](https://ai.google.dev/gemini-api/docs/billing), [API keys](https://ai.google.dev/gemini-api/docs/api-key), [available regions](https://ai.google.dev/gemini-api/docs/available-regions), [billing in Brazil](https://support.google.com/cloud/answer/7522866)
- **OpenRouter:**
  - [FAQ](https://openrouter.ai/docs/faq), [authentication](https://openrouter.ai/docs/api-reference/authentication), [creating keys](https://openrouter.ai/docs/api/api-reference/api-keys/create-keys)
  - models: [Claude Opus 5](https://openrouter.ai/anthropic/claude-opus-5), [Claude Sonnet 5](https://openrouter.ai/anthropic/claude-sonnet-5), [GPT-5.6 Sol](https://openrouter.ai/openai/gpt-5.6-sol), [GPT-5.6 Terra](https://openrouter.ai/openai/gpt-5.6-terra), [Gemini 3.1 Pro](https://openrouter.ai/google/gemini-3.1-pro-preview), [Gemini 3.8 Flash](https://openrouter.ai/google/gemini-3.8-flash), [Nano Banana Pro](https://openrouter.ai/google/gemini-3-pro-image-preview), [Nano Banana 2](https://openrouter.ai/google/gemini-3.1-flash-image)
- **fal:**
  - [sign-in](https://fal.ai/login), [FAQ](https://fal.ai/docs/documentation/model-apis/faq), [authentication](https://fal.ai/docs/model-apis/authentication), [terms](https://fal.ai/terms)
  - models: [Veo 3.1 Lite](https://fal.ai/models/fal-ai/veo3.1/lite/image-to-video), [Kling 3.0](https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video), [Seedance 2.5](https://fal.ai/models/bytedance/seedance-2.5/image-to-video), [LTX-2.5 Fast](https://fal.ai/models/lightricks/ltx-2.5/image-to-video/fast), [MiniMax H3 Max](https://fal.ai/models/minimax/h3-max/image-to-video), [H3 Max Turbo](https://fal.ai/models/minimax/h3-max-turbo/image-to-video), [Kling Avatar 2.0](https://fal.ai/models/fal-ai/kling-video/ai-avatar/v2/standard), [Nano Banana Pro](https://fal.ai/models/fal-ai/nano-banana-pro), [Nano Banana 2](https://fal.ai/models/fal-ai/nano-banana-2), [HiDream-O1-Image](https://fal.ai/models/fal-ai/hidream-o1-image), [Z-Image-Turbo](https://fal.ai/models/fal-ai/z-image/turbo), [Qwen-Image-Edit-2511](https://fal.ai/models/fal-ai/qwen-image-edit-2511), [FLUX.2 klein 4B](https://fal.ai/models/fal-ai/flux-2/klein/4b/edit), [GPT Image 2.5](https://fal.ai/models/openai/gpt-image-2.5/sunburst/text-to-image), [Eleven v3](https://fal.ai/models/fal-ai/elevenlabs/tts/eleven-v3)
- **Replicate:**
  - [sign-in](https://replicate.com/signin), [prepaid credit](https://replicate.com/docs/topics/billing/prepaid-credit), [API tokens](https://replicate.com/docs/topics/security/api-tokens), [terms](https://replicate.com/terms)
  - models: [Kling 3.0](https://replicate.com/kwaivgi/kling-v3-video), [Veo 3.1 Lite](https://replicate.com/google/veo-3.1-lite), [Seedance 2.5](https://replicate.com/bytedance/seedance-2.5), [MiniMax H3](https://replicate.com/minimax/h3), [LTX-2.5 Fast](https://replicate.com/lightricks/ltx-2.5-fast), [Z-Image-Turbo](https://replicate.com/prunaai/z-image-turbo)
- **ElevenLabs:** [pricing](https://elevenlabs.io/pricing), [API pricing](https://elevenlabs.io/pricing/api), [pay as you go](https://elevenlabs.io/docs/overview/administration/pay-as-you-go), [accounts and sign-in](https://elevenlabs.io/docs/overview/administration/account), [API keys](https://elevenlabs.io/docs/overview/administration/workspaces/api-keys), [country restrictions](https://elevenlabs.io/docs/help-center/legal/do-you-restrict-access-to-the-service-and-platform-for-any-specific-countries)
- **Deepgram:** [pricing](https://deepgram.com/pricing), [terms](https://deepgram.com/terms), [creating keys](https://developers.deepgram.com/docs/create-additional-api-keys), [sign-in methods (a Deepgram staff reply)](https://github.com/orgs/deepgram/discussions/1327)
- **MiniMax:** [pay as you go](https://platform.minimax.io/docs/guides/pricing-paygo), [account FAQ](https://platform.minimax.io/docs/faq/about-account), [API FAQ](https://platform.minimax.io/docs/faq/about-apis)
- **LTX:** [pricing](https://docs.ltx.io/pricing), [buying credits](https://help.ltx.io/hc/en-us/articles/32897133751826-How-to-buy-API-credits), [authentication](https://docs.ltx.io/authentication), [finding your key](https://help.ltx.io/hc/en-us/articles/32895500338578-Where-to-find-your-API-key)
- **Hugging Face:** [sign-in](https://huggingface.co/login), [access tokens](https://huggingface.co/docs/hub/security-tokens), [rate limits](https://huggingface.co/docs/hub/rate-limits)
- **Kling:** [API pricing](https://kling.ai/dev/pricing), [authentication](https://kling.ai/document-api/api/get-started/authentication), [quick start](https://kling.ai/document-api/guides/get-started/quick-start)
- **BytePlus:** [activating Seedance 2.5](https://docs.byteplus.com/en/docs/ModelArk/2637911), [availability](https://docs.byteplus.com/en/docs/ModelArk/availability), [model pricing](https://docs.byteplus.com/en/docs/ModelArk/1544106), [API keys](https://docs.byteplus.com/en/docs/ModelArk/1361424), [identity verification](https://ai.byteplus.com/en/help/article/what-identity-verification-real-name-kyc-is-required-and-what-documents-do-i-need)

Read on 15 September 2026:
- **OpenAI:** help centre, in a browser: [prepaid billing](https://help.openai.com/en/articles/8264644-how-can-i-set-up-prepaid-billing), [phone verification](https://help.openai.com/en/articles/8983040-what-does-phone-verification-look-like), [sign-in methods](https://help.openai.com/en/articles/4936824-can-i-change-how-i-log-into-my-account-authentication-method), [organisation verification](https://help.openai.com/en/articles/10910291-api-organization-verification); [changelog](https://developers.openai.com/api/docs/changelog)
- **OpenRouter:** its sign-up page and first-run steps, while an account was opened; [terms](https://openrouter.ai/terms), read in a browser; [limits](https://openrouter.ai/docs/api_reference/limits); each model's endpoints, such as [Claude Opus 5's](https://openrouter.ai/api/v1/models/anthropic/claude-opus-5/endpoints)
- **fal:** its sign-in page, dashboard, Settings menu and API Keys page, with the *New Key* window, while an account was opened and a key made; [terms](https://fal.ai/legal/terms-of-service), read in a browser; [accounts and identity](https://fal.ai/docs/documentation/setting-up/accounts-and-identity); [Nano Banana 2](https://fal.ai/models/fal-ai/nano-banana-2)
