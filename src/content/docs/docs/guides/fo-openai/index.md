---
title: "fo-openai: OpenAI platform"
description: "Render GPT Image 2.5 from text and carry OpenAI analysis requests, with the plug-in's own OpenAI key."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai/index.md
sidebar:
  label: fo-openai
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/), [Platform Connectors](../plugin-types/platform-connectors/).

Render GPT Image 2.5 pictures from text through OpenAI, and carry the requests of [character photo analysis](../fo-openai-vision/), [character changes](../fo-openai-character/) and [style analysis](../fo-openai-style/). Those packages call this one and need no key of their own.

**fo-openai v7** needs FilmOpen API 1, revision 10.

## Set up and check

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** in **Settings → Plugins**.
2. In **Settings → Provider keys**, enter your OpenAI API key on this plug-in's card, **OpenAI key**, and save it. The key is the plug-in's own; it reads no other key slot.
3. Press **Check** under **Can it work?**. This performs a read-only model-list check.
4. For a small test, render one GPT Image 2.5 picture from a short prompt, or follow an analysis package's guide. Inspect the result and its Usage entry.

A successful key check does not guarantee access to every model, an account balance, or any provider organization verification that a model requires. A ChatGPT subscription is not an API key.

The host inserts the credential into permitted HTTPS requests. The JavaScript never receives it.

## Rendering

The plug-in renders text to image for the catalogue's GPT Image 2.5 entries marked for OpenAI: its two rows, Flare and Sunburst. The resolutions, quality levels and output formats offered are the catalogue's. It takes no input image: editing from a reference image stays on [fo-fal](../fo-fal/). One render is one image.

## Failures and cost

Each render is one request to OpenAI, never a second. A lost or timed-out answer is reported as uncertain: check your OpenAI usage before rendering again, since the first request may already have been charged. A refusal before sending, such as a missing key, submits nothing to OpenAI.

The price shown before a render is FilmOpen's estimate from the catalogue. The bill recorded after it is OpenAI's reported token counts at the catalogue row's prices; where those counts or prices are missing, the cost is recorded as unknown, never as zero. A price calculated from returned tokens is different from a provider invoice amount.

Raw requests and credential checks are not proposed for remote sharing. [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation).
