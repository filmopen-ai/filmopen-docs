---
title: "fo-openrouter: text completions"
description: "A separate OpenRouter platform and text-completion provider."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openrouter/index.md
sidebar:
  label: fo-openrouter
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).


Enable **fo-openrouter** and allow its package. It declares its own OpenRouter key in the existing Provider keys UI; the host verifies/stores the key and inserts it into permitted HTTPS requests. It is separate from fal and its image adapters.

The platform supports status, relative requests, one-request execution and text completion using FilmOpen catalogue access rows for `openrouter`. It maps supported completion options, preserves zero-valued parameters, returns provider usage/cost when present and exposes a catalogue-rate estimate when enough information is available.

Text completion accepts a supported message conversation and explicit model/variant. Unknown options, unsupported catalogue access and conflicting raw model IDs are refused. A transport failure after submission is uncertain; the plugin does not retry it automatically. The current text adapter does not make arbitrary image/video endpoints into render plugins.

An assistant such as [fo-assist](../fo-assist/) can call through FilmOpen's AI routing without owning another key. Raw provider requests and keys are not shareable operations. [OpenRouter API documentation](https://openrouter.ai/docs/quickstart).
