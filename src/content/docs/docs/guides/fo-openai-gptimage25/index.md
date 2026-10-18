---
title: "GPT Image 2.5: OpenAI"
description: "Generate images through OpenAI and inspect options and usage costs."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-gptimage25/index.md
sidebar:
  label: fo-openai-gptimage25
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).

**fo-openai-gptimage25** generates GPT Image 2.5 images through **fo-openai**, using your OpenAI API key. For catalogue-marked GPT Image models on fal, see [fo-fal](../fo-fal/).

## Set up and render

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** and **fo-openai-gptimage25**.
2. Save and verify the existing app OpenAI key in **Settings → Provider keys**, then grant **fo-openai** access under its **Keys** section.
3. Open an editable character. In **Reference images**, use the add control and choose **Render**.
4. Choose GPT Image 2.5 under **Model**. Where both routes are available, choose OpenAI under **Runs on**. A sole available route is already selected; a route with missing setup explains why it cannot run.
5. For a small first test, use **Flare**, **low** quality, **1024×1024**, opaque background and PNG. Enter a short **Your prompt** and review the displayed approximate price.
6. Press **Render** once. Open the completed image tile and check that it is retained on this character. Inspect the corresponding Usage record.

Keys never enter the model's parameters. A failed OpenAI job is not automatically sent to another provider.

## Options

| Option | Supported values |
|---|---|
| Variant | `flare` (default), `sunburst` |
| Quality | `low` (default), `medium`, `high`, `xhigh`, `max`, `auto` |
| Resolution | `1024x768`, `1024x1024` (default), `1024x1536`, `1536x1024`, `2560x1440`, `3840x2160` |
| Background | `auto`, `opaque`, `transparent` |
| Format | `png`, `jpeg`, `webp` |
| Compression | Integer 0–100 for JPEG/WebP only |
| Count | One image |

Transparency requires PNG or WebP. 4K is experimental upstream. This OpenAI adapter implements text-to-image; it does not implement reference-image editing or promise a reproducible seed.

## Prices and usage

The displayed price is approximate. Size, quality, prompt length, actual token use, account pricing and provider rounding can change the charge. Automatic quality is not a spending ceiling. At rates checked on 21 September 2026, a 1024-square low-quality draft was estimated around $0.0064, while high quality was around $0.0532. These examples are not guaranteed current debits.

OpenAI's returned text/image token counts are priced at published rates with a **price** basis. Missing or inconsistent token details retain an **estimate**. That differs from a provider reporting an exact dollar charge.


## Troubleshooting

If the model is unavailable, check both adapter and connector are on, their permissions, the selected route's key, and any capability warning. Direct OpenAI requires the app's inline-image support. A connection check cannot prove model access or credit.

A lost response can leave the job accepted remotely. Inspect its receipt/Usage before manually repeating it. Prompts and returned image bytes do not belong in troubleshooting logs. Proposed sharing metadata does not publish an API or expose keys.

Provider reference: [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation).
