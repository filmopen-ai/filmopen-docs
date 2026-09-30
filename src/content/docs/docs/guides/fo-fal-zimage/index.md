---
title: "fo-fal-zimage: Z-Image Turbo on fal"
description: "Cloud Z-Image options, estimated prices and usage receipts."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-zimage/index.md
sidebar:
  label: fo-fal-zimage
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).

Generate Z-Image Turbo images through fal's `fal-ai/z-image/turbo` endpoint. No local ComfyUI, stack download or safetensors are required.

## Set up and render

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-fal** and **fo-fal-zimage**.
2. Save and verify the fal plugin's key in **Settings → Provider keys**. Follow the [connector setup](../fo-fal/) if its field is missing.
3. Open an editable character. In **Reference images**, use the add control and choose **Render**.
4. Choose Z-Image Turbo under **Model**. If more than one destination is available, select fal under **Runs on**.
5. For a small first test, select **512×512**, **Draft**, and leave **Expand the prompt** off. Enter a short **Prompt** and check the displayed estimated price.
6. Press **Render** once. When the job completes, open the new image tile and confirm the character retained it. Inspect its Usage record and whether the cost is estimated or provider-reported.

## Options

| Option | Values |
|---|---|
| Resolution | 512², 768², 1024², 768×1024, 1024×768, 768×1344, 1344×768, 1536² |
| Draft | 4 steps, high acceleration |
| Standard (default) | 8 steps, regular acceleration |
| Quality | 8 steps, no acceleration |
| Expand the prompt | Off by default |
| Format | PNG, JPEG, WebP |
| Count | One image |

This adapter supports text-to-image, not reference-image editing. The host seed is passed to fal and the safety checker remains enabled.

The options action supplies approximate prices by resolution, quality and prompt expansion. At the checked September 2026 snapshot the rate was $0.005 per megapixel plus $0.0025 for prompt expansion; a 512-square draft without expansion estimated $0.00131072 before rounding or account differences. Use the current displayed quote, not this historical example, to decide whether to submit.

After rendering the adapter asks fal's billing API for the exact receipt. If accessible it records the provider charge; otherwise it retains an explicit estimate and reason. Billing unavailability does not discard a completed image. See [billing limitations](../fo-fal/).

Missing keys, disabled dependencies and unsupported options are handled before submission. A timeout can mean fal still has the job: check its receipt before a manual retry. The render operation's proposed sharing metadata enables no relay. [Endpoint and pricing](https://fal.ai/models/fal-ai/z-image/turbo).
