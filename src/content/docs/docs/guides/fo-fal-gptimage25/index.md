---
title: "fo-fal-gptimage25: GPT Image 2.5 on fal"
description: "Render Flare or Sunburst through the fal platform with shared GPT Image options."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-gptimage25/index.md
sidebar:
  label: fo-fal-gptimage25
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).

Render GPT Image 2.5 through the fal queue using your fal key. This adapter adds no separate credential field and downloads no local weights.

## Set up and render

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-fal** and **fo-fal-gptimage25**.
2. Save and verify the fal plugin's key in **Settings → Provider keys**. Check the [fal connector](../fo-fal/) if it is unavailable.
3. Open an editable character's **Reference images** add control and choose **Render**.
4. Select GPT Image 2.5 under **Model**, then fal under **Runs on** if there is a choice.
5. Use Flare, low quality, 1024×1024 and PNG for a small test. Enter a short prompt, review the approximate price and press **Render** once.
6. Open the completed image and check its Usage entry. The entry should retain a receipt and distinguish a provider-reported debit from an estimate.

The [shared GPT Image 2.5 guide](../fo-openai-gptimage25/) lists all supported sizes, quality levels, background/format options and cost behavior. The fal routes are `openai/gpt-image-2.5/flare/text-to-image` and `openai/gpt-image-2.5/sunburst/text-to-image`.

A fal key does not authorize the OpenAI route. A failed or uncertain job is never automatically resubmitted through another provider. fal billing can remain estimated even when the image itself completed successfully.
