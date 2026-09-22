---
title: "GPT Image 2.5: OpenAI and fal"
description: "One set of image options with explicit OpenAI or fal routing and usage costs."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-gptimage25/index.md
sidebar:
  label: fo-openai-gptimage25
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/).


Enable **fo-openai** and **fo-openai-gptimage25** for direct OpenAI rendering. Save/verify the app's existing OpenAI key and allow the platform plugin to use it. The direct adapter also checks for host inline-image support before it allows rendering. A host without that bridge can still use the [fal adapter](../fo-fal-gptimage25/).


GPT Image 2.5 is one model choice with two transport adapters: `fo-openai-gptimage25` and `fo-fal-gptimage25`. They carry byte-identical shared option/validation code. The temporary integration presents one model and a **Provider key** selector; it automatically selects the sole available route and disables the model when no route has a stored, permitted key and enabled dependencies. It rechecks availability before submitting. Keys themselves never enter model parameters.

The normal application render UI is being integrated separately. The plugin-lab selector, inline-image bridge and extended usage accounting are currently experimental host features.

## Options

| Option | Supported values |
|---|---|
| Variant | `flare` (default), `sunburst` |
| Quality | `low` (default), `medium`, `high`, `xhigh`, `max`, `auto` |
| Resolution | `1024x768`, `1024x1024` (default), `1024x1536`, `1536x1024`, `2560x1440`, `3840x2160` |
| Background | `auto`, `opaque`, `transparent` |
| Format | `png`, `jpeg`, `webp` |
| Compression | Integer 0–100 for JPEG/WebP only |
| Count | One image per request |

Transparency requires PNG or WebP. 4K is experimental upstream. These plugins currently implement text-to-image; reference-image editing is not yet implemented. Neither route supports a reproducible seed: results return `seedApplied: false`, and the temporary UI hides the seed input.

```json
{
  "model": "t2i-gpt-image-25",
  "prompt": "Portrait of a woman wearing a blue hat",
  "inputs": {},
  "params": {
    "variant": "flare",
    "resolution": "1024x1024",
    "quality": "low",
    "background": "auto",
    "output_format": "png"
  }
}
```

The host supplies its ordinary render envelope. Select the transport explicitly in the application; there is no automatic provider switch if rendering fails.

## Prices and usage

`render-options` returns an approximate USD price for every offered size/quality combination. Variants share the published token rates. Estimates use output baselines plus a rough short-prompt allowance; a long prompt, automatic quality, actual token use, account pricing and provider rounding can change the charge. Landscape uses a portrait baseline approximation. `auto` shows an indicative high-quality estimate, not a ceiling.

At the checked rates (21 September 2026), a 1024-square low-quality draft is estimated around **$0.0064**; high quality around **$0.0532**. Do not treat these as guaranteed debit amounts.

OpenAI's returned text/image token counts are priced at published rates and recorded with the **price** basis. Missing or inconsistent token details retain an **estimate**. An unsplit cached-token count cannot be precisely priced and also stays estimated. This is distinct from a provider reporting an exact dollar charge.

fal's image response provides an image URL, not a final charge. The adapter checks billing separately for the exact request ID and endpoint. When accessible, it records a **provider** cost; when billing scope is unavailable or billing is pending, it records an **estimate** with the reason and receipt. It never silently treats an estimate as a final charge or zero spend. Administrative billing credentials are not required for rendering.

The temporary app writes these records to its existing Usage ledger, including provider, selected model/variant, receipt when supplied, and available token counts. The production host must adopt the documented accounting hook to preserve these distinctions.

## Errors and sharing

Missing keys, missing grants and unsupported options fail before submission. Service refusals, uncertain submission and malformed media are logged through FilmOpen. There are no automatic paid retries. Check the receipt before manually repeating a job whose result was lost. Closing FilmOpen does not prove that a submitted remote job stopped.

The manifest proposes only the named model render operation for future sharing. This is inert metadata, not authorization to publish an API or expose a key. Host and relay access, pricing, credit transfer and result validation are separate work.

Provider references: [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation), [fal GPT Image 2.5 overview and measured prices](https://fal.ai/gpt-image-2.5), [fal Flare API schema](https://fal.ai/models/openai/gpt-image-2.5/flare/text-to-image/api), [fal Sunburst API schema](https://fal.ai/models/openai/gpt-image-2.5/sunburst/text-to-image/api).
