---
title: "fo-openai: OpenAI platform"
description: "Use the existing FilmOpen OpenAI key for image generation and structured analysis."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai/index.md
sidebar:
  label: fo-openai
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).


`fo-openai` is the transport plugin for [GPT Image 2.5 on OpenAI](../fo-openai-gptimage25/). Enable both packages and allow their declared permissions.

It borrows the **existing OpenAI key** in FilmOpen's Provider keys (`app:openai`). It does not add another OpenAI input box or put credentials in JavaScript. The host inserts the credential into HTTPS requests to OpenAI. A stored key must also be allowed for the plugin.

| Function | Purpose |
|---|---|
| `availability` | Local key presence and permission check; no network request or charge |
| `status` | Read-only OpenAI model-list check |
| `request` | Relative request through the host's OpenAI connection |
| `run` | One GPT Image 2.5 image-generation request |
| `responses` | GPT-6 Astra structured analysis through the Responses API |

The transport supports the Flare and Sunburst model IDs. It records the response request ID when provided and never retries a paid submission automatically. A timeout can mean that OpenAI accepted the job; inspect usage before submitting again. A successful key verification does not guarantee access to every model, remaining credit, or organization verification.

OpenAI returns base64 image data. The model adapter requires a compatible host image-ingestion bridge and remains unavailable before submission when that capability is absent. The current plugin-lab bridge is experimental; the permanent app integration is separate.

The platform's raw requests and key checks are not proposed for remote sharing. See the [OpenAI image-generation guide](https://developers.openai.com/api/docs/guides/image-generation).

The platform also offers GPT-6 Astra Responses transport for the [photo analyzer](../fo-openai-vision/), using the same app-owned key and grant.
