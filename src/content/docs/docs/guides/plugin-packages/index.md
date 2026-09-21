---
title: "FilmOpen plugin packages"
description: "Platform, model and assistant packages and their integration status."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-packages/index.md
sidebar:
  label: plugin-packages
  order: 1
---

Platform packages own connections and credentials. Model adapters own workflows or API mappings. The host owns consent, credential storage, media ingestion and the Usage ledger. These packages use FilmOpen API 1/revision 1; experimental host extensions are identified in their guides.

| Package | Purpose |
|---|---|
| [fo-cui](../fo-cui/) | ComfyUI transport and discovery |
| [fo-salad](../fo-salad/) | On-demand ComfyUI GPU servers and shutdown leases (experimental) |
| [fo-cui-zimage](../fo-cui-zimage/) | Local Z-Image stacks and verification |
| [fo-cui-ltx](../fo-cui-ltx/) | Short local image-to-silent-video |
| [fo-fal](../fo-fal/) | fal key, queue, pricing and billing |
| [fo-fal-zimage](../fo-fal-zimage/) | Cloud Z-Image options and cost receipts |
| [fo-openai](../fo-openai/) | OpenAI transport using the existing app key |
| [fo-openai-gptimage25](../fo-openai-gptimage25/) | Direct GPT Image 2.5 and shared model guide |
| [fo-fal-gptimage25](../fo-fal-gptimage25/) | GPT Image 2.5 through fal |
| [fo-openrouter](../fo-openrouter/) | Text completions |
| [fo-elevenlabs](../fo-elevenlabs/) | Voice Design v3, persistent voice IDs and speech WAV |
| [fo-openai-vision](../fo-openai-vision/) | GPT-6 Astra photo attributes and generation prompt |
| [fo-fal-voice](../fo-fal-voice/) | Audio understanding and original voice-design prompt |
| [fo-assist](../fo-assist/) | Assistant action over host AI routing |

The plugin-lab render UI is a temporary integration example. Permanent render management, insertion, upload/inline-media support and extended accounting remain application integration work; installing a package alone does not add that UI. No package's sharing proposal enables a live relay.

Source and tests: [filmopen-plugins repository](https://github.com/filmopen-ai/filmopen-plugins). For authoring, see the [plugin guide](../plugins/).
