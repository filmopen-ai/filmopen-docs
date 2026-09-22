---
title: "fo-assist: assistant action"
description: "An assistant that uses FilmOpen routing without owning credentials."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-assist/index.md
sidebar:
  label: fo-assist
  order: 1
---

Plugin types: [Assistants](../plugin-types/assistants/).


`fo-assist` demonstrates a FilmOpen assistant action over the host's AI routing. It owns no credentials. Enable it and an appropriate completion provider, such as [fo-openrouter](../fo-openrouter/), and configure that provider's key and permissions.

Its **Ask** action uses the configured prompt and model through `ctx.ai.complete`. An empty prompt produces a local message without a provider request. The answer becomes a localized action result. Provider errors and usage remain part of the host's normal call chain.

This package is an assistant example, not a combined fal/OpenRouter provider and not an image-generation model adapter. Its status can describe incomplete provider setup. It proposes no remote sharing operation.
