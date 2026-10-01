---
title: "fo-openai: OpenAI platform"
description: "Use the existing FilmOpen OpenAI key for image generation and structured analysis."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai/index.md
sidebar:
  label: fo-openai
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).

Use the OpenAI API connection for [GPT Image 2.5](../fo-openai-gptimage25/), [character photo analysis](../fo-openai-vision/), [character changes](../fo-openai-character/) and [style analysis](../fo-openai-style/).

## Set up and check

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** in **Settings → Plugins**.
2. In **Settings → Provider keys**, save and verify the app's existing **OpenAI** key. This package borrows that slot; it does not add a second OpenAI key box.
3. Open the OpenAI plugin page. Under **Keys**, allow it to use the OpenAI key. Saving a key does not by itself grant a plugin access.
4. Press **Check** under **Can it work?**. This performs a read-only model-list check.
5. Install and allow the desired model or analysis adapter, then follow its guide for one small test. Inspect the result and Usage entry.

A successful key check does not guarantee access to every model, an account balance, or any provider organization verification that a model requires. A ChatGPT subscription is not an API key.

The host inserts the credential into permitted HTTPS requests. The JavaScript never receives it. The connector supports image generation and structured Responses requests; the application handles authorized image input and returned inline media.

## Failures and cost

This connector does not retry a paid submission automatically. A lost response can leave a charge or completed result at the provider; inspect usage before submitting again. Missing key/grant and unsupported host capability should be resolved before a request.

Image and analysis adapters describe how token usage and approximate costs are recorded. A price calculated from returned tokens is different from a provider invoice amount.

Raw requests and credential checks are not proposed for remote sharing. [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation).
