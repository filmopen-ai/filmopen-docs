---
title: "fo-fal: fal rendering"
description: "Render catalogue-marked fal models and check their results and costs."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal/index.md
sidebar:
  label: fo-fal
  order: 1
---

Plugin types: [Image Generation](../plugin-types/image-generation/), [Platform Connectors](../plugin-types/platform-connectors/).

**fo-fal v8** renders models marked for fal rendering in FilmOpen's catalogue. It also supplies queue transport and receipt-scoped billing. Install **fo-fal** itself for these images; no separate fal image adapter is needed. It requires API 1, revision 10.

## Models

The marked models are Z-Image Turbo, GPT Image 2.5 generation, FLUX.2 klein 4B editing and GPT Image 2.5 editing. Options and variants come from the catalogue. FilmOpen prices from the catalogue; the plug-in does not provide a render estimate of its own.

Z-Image Turbo generates from a prompt. The editing models use one reference image for a character sheet. GPT Image does not apply a seed, so a saved seed does not promise the same image again.

## Set up and check a render

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-fal** in **Settings → Plugins**. Save its fal key in FilmOpen and allow the plug-in to use it. The [fal platform guide](/docs/platforms/fal/) explains obtaining a key.
2. Use **Check** under **Can it work?** on its plug-in page. This checks service access; it does not prove access to every model or a remaining balance.
3. Open an editable character, use the add control for its reference images and choose **Render**.
4. Check **Model**, **Runs on** and **Way of running it**. For a small generation test choose Z-Image Turbo on fal at 1024×1024. Enter **Your prompt**, or inspect the **Default prompt** supplied by a [prompt writer](../fo-prompts/), and review the price before continuing.
5. Press **Render** once. Open the completed image and check that it stays on this character. Inspect its Usage record and cost.
6. To check a sheet, first keep a reference image on the character. Render a sheet with FLUX.2 klein 4B editing or GPT Image 2.5 editing, then inspect the sheet and its Usage record.

The [model picker](../fo-model-picker/) supplies defaults for the character's render stage. You can inspect the chosen model and route before rendering. The [voice analysis package](../fo-fal-voice/) still uses fo-fal as its connector.

## Queue and cost behavior

Submission is fenced against a second charge for the same job. Collection checks the original request; it never uploads the reference again or submits another render. A lost acknowledgement leaves the outcome uncertain. Inspect the provider's job and Usage before manually starting another render.

Billing lookup is separate from rendering. A denied billing lookup or invalid billing events leave the cost unknown; a provider-confirmed zero remains zero. A catalogue price is not proof of the final debit. Cancelling a request does not by itself confirm that it stopped.

Troubleshooting logs record stages, mapping fields, state changes and safe codes. Keep prompts, reference images, credentials, request bodies and output URLs out of shared logs.
