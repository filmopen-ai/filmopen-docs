---
title: "fo-fal-gptimage25: GPT Image 2.5 on fal"
description: "Render Flare or Sunburst through the fal platform with shared GPT Image options."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-gptimage25/index.md
sidebar:
  label: fo-fal-gptimage25
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).


Enable **fo-fal** and **fo-fal-gptimage25**, then save/verify the fal key supplied by the platform plugin in Provider keys. This model adapter adds no separate key field and requires no local model downloads.

It invokes `openai/gpt-image-2.5/flare/text-to-image` or `openai/gpt-image-2.5/sunburst/text-to-image` through fal's queue. The host downloads the resulting image and adds it to the character's media through the normal ingestion flow.

See the [shared GPT Image 2.5 guide](../fo-openai-gptimage25/) for the complete options, common UI behavior, estimated prices, no-key handling and usage accounting. Options match the direct OpenAI adapter; the transport and billing receipt mechanisms differ. A fal key does not grant the OpenAI adapter permission to use it, and a failed job is never automatically sent to another provider.
