---
title: "fo-assist: assistant action"
description: "An assistant that uses FilmOpen routing without owning credentials."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-assist/index.md
sidebar:
  label: fo-assist
  order: 1
---

Plugin types: [Assistants](../plugin-types/assistants/).

**fo-assist** provides an **Ask** action through FilmOpen's selected text provider. It owns no credential and is not an image-generation model.

## Set up and ask

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-assist** and [fo-openrouter](../fo-openrouter/). Save and verify the OpenRouter plugin's key.
2. Open **Settings → Plugins → AI assistant**. Under **Settings on this computer**, choose an available **Text model** and enter a short request in **Ask the text model**.
3. Under **Actions**, run **Ask**. Read its answer and inspect the corresponding Usage entry.
4. Try an empty prompt: the action reports that locally and makes no text-model request. Enter text before the real test.

The package also declares an **Image model** setting, but **Ask** uses the text model. It does not create an image.

In **fo-assist v2**, **Check** asks OpenRouter for its status. Neither **Check** nor **Ask** requires fal. The **Image model** setting does not change this text-only operation.

The answer is an action result, not a character rewrite. For controlled character JSON changes and a comparison, use [fo-openai-character](../fo-openai-character/). Errors and usage follow the host's normal call chain. No remote sharing operation is proposed.
