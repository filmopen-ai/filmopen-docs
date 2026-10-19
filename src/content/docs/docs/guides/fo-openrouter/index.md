---
title: "fo-openrouter: text completions"
description: "A separate OpenRouter platform and text-completion provider."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openrouter/index.md
sidebar:
  label: fo-openrouter
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).

This package provides text completions through OpenRouter. It is separate from fal and from image-generation adapters.

## Set up and test

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openrouter**.
2. In **Settings → Provider keys**, save and verify the OpenRouter plugin's key.
3. Open the plugin page and press **Check** under **Can it work?**. A valid key does not guarantee access to every catalogue model or remaining credit.
4. Install and allow [fo-assist](../fo-assist/) to exercise a text request through the normal app controls. Choose an available OpenRouter text model in the assistant's settings and enter a short prompt.
5. Run **Ask**, verify a text answer appears, and inspect Usage for the model/provider and available token/cost details.

The adapter uses FilmOpen catalogue access rows for `openrouter`; a model must be supported there. It preserves zero-valued options and returns provider usage/cost when supplied, otherwise a catalogue-rate estimate when enough information is available.

Unknown options, unsupported model access and conflicting raw model IDs are refused. A transport failure after submission can be uncertain; no paid request is automatically retried. This text adapter does not make arbitrary image/video endpoints into render models.

The host owns credentials and usage accounting. Raw provider requests and keys are not shareable operations. [OpenRouter API documentation](https://openrouter.ai/docs/quickstart).
