---
title: "fo-fal: fal platform"
description: "A separate fal key, queue transport, pricing and receipt-scoped billing."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal/index.md
sidebar:
  label: fo-fal
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).

The fal connector owns the account key, queue transport, pricing and receipt-scoped billing. Model adapters own their model-specific options; they never receive the secret.

## Set up and check

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-fal** in **Settings → Plugins**.
2. Open **Settings → Provider keys** and enter your key in the fal plugin's field. Save it and read the verification result. The [fal platform guide](/docs/platforms/fal/) explains obtaining a key.
3. Return to the fal plugin page and press **Check** under **Can it work?**. A successful check verifies service access, not every model or your remaining balance.
4. Install and allow a model adapter: [Z-Image Turbo](../fo-fal-zimage/), [GPT Image 2.5](../fo-fal-gptimage25/) or [voice analysis](../fo-fal-voice/).
5. Follow that adapter's small test. After completion, check the media or analyzed fields and its Usage entry.

If the key field is absent, confirm **fo-fal** is installed and on. The connector's key is distinct from OpenRouter and from the app's OpenAI key. A stored key and a permission to use a key are separate requirements.

## Queue and cost behavior

The connector submits once, checks receipt URLs against the expected fal queue host and request ID, and retrieves the result. A lost submission response or exhausted wait can leave the outcome uncertain. Check its receipt before explicitly trying again; no automatic paid retry or provider switch occurs.

Billing lookup is separate from rendering. Some keys can render but cannot read administrative billing events. An adapter can retain an estimated cost and receipt in that case; it must not call that a confirmed debit. A reported zero is preserved as zero. A pricing endpoint describes a rate, not necessarily the final charge for a finished job.

Raw HTTP requests and account keys are not proposed for sharing. Any future sharing exposes bounded model operations through the host, not this account connection. [fal APIs](https://docs.fal.ai/).
