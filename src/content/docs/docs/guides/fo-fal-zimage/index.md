---
title: "fo-fal-zimage: Z-Image Turbo on fal"
description: "Cloud Z-Image options, estimated prices and usage receipts."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal-zimage/index.md
sidebar:
  label: fo-fal-zimage
  order: 1
---

Enable **fo-fal** and **fo-fal-zimage**, allow both packages and save the fal key in Provider keys. This adapter uses `fal-ai/z-image/turbo`; it owns no key or local ComfyUI connection. No stacks or safetensors are needed.

## Options

| Option | Values |
|---|---|
| Resolution | 512², 768², 1024², 768×1024, 1024×768, 768×1344, 1344×768, 1536² |
| Draft | 4 steps, high acceleration |
| Standard (default) | 8 steps, regular acceleration |
| Quality | 8 steps, no acceleration |
| Prompt expansion | Off by default |
| Format | PNG, JPEG, WebP |
| Count | One image |

Use resolution strings such as `512x512` and quality IDs `draft`, `standard`, `quality`. The host's unsigned 32-bit seed is passed to fal. Only text-to-image with empty `inputs` is supported. The safety checker remains enabled.

The options action returns 48 size/quality/expansion price combinations. At the checked snapshot the estimate is $0.005 per megapixel, plus $0.0025 for prompt expansion. Quality changes steps and acceleration, not the published megapixel rate. For example, a 512-square draft without expansion estimates $0.00131072 before any provider rounding/account differences.

The temporary popup shows these estimates and the app records usage in its existing ledger. After rendering, the adapter checks fal's billing API for the exact receipt. It records a provider-reported charge when available and otherwise an explicit estimate. See [fal billing limitations](../fo-fal/).

Only supported images on the fal media CDN are returned for host ingestion. Failures reach the app logger. Billing unavailability does not discard an already completed image. No paid submission is automatically repeated.

The render operation is proposed for future host-controlled sharing; the metadata itself grants no remote access. [Provider endpoint and pricing](https://fal.ai/models/fal-ai/z-image/turbo).
