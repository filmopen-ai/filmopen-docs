---
title: "fo-prompts: default character prompts"
description: "Prepare editable English prompts for a character portrait or sheet."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-prompts/index.md
sidebar:
  label: fo-prompts
  order: 1
---

Plugin types: [Prompt Writers](../plugin-types/prompt-writers/).

**fo-prompts v1** writes an English default prompt for a character's reference image or sheet. It needs API 1, revision 10. Writing is local: no key, network setup or separate AI call is needed. Rendering still uses the chosen model and provider.

## Use a default prompt

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-prompts** in **Settings → Plugins**.
2. Open an editable character with no prompt of its own. From **Reference images**, open **Render** and inspect the selected **Model**.
3. The box is labelled **Default prompt** while it holds the writer's words. Inspect and edit them before rendering. Once you type, the label becomes **Your prompt**; your edit belongs to this render.
4. For a sheet, keep a reference image first, then open **Render** from **Sheets**. Without one, FilmOpen says **Make a reference image first.**

Changing the model asks for its default prompt again until you edit the text yourself. Your own existing prompt is kept instead of being replaced by a writer.

## What it writes

The reference-image prompt asks for a neutral, well-lit, front-facing head-and-shoulders portrait on a plain background. It uses the character's present age, gender, build, skin, hair, eyes, face and marks. Missing fields are omitted; clothing is not invented.

The sheet prompt asks for front, left side, right side and back views, full figure and details, keeping the same person and clothes as the reference. [fo-gpt-expressions](../fo-gpt-expressions/) can override that default for GPT Image 2.5 editing to add facial expressions.

This package supplies no default prompt for locations, shots, outfits or first frames.

## If writing fails

The app reports **The default prompt could not be written ({code}).**, with the failure's code in place of `{code}`. The box stays empty for you to write **Your prompt**. A writing failure does not mean a render was sent.

For troubleshooting, keep the failure code; do not share character content or prompt text in logs. The plug-in logs the selection, field and character counts, decision reasons and failure stage without logging the words it reads or writes.
