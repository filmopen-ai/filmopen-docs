---
title: "fo-gpt-expressions: expressive character sheets"
description: "Add a row of facial expressions to a GPT Image 2.5 character sheet."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-gpt-expressions/index.md
sidebar:
  label: fo-gpt-expressions
  order: 1
---

Plugin types: [Prompt Writers](../plugin-types/prompt-writers/).

**fo-gpt-expressions v1** overrides the default prompt for a character sheet made with GPT Image 2.5 editing (`i2i-gpt-image-25`). It needs API 1, revision 10. It writes locally without a key or network setup and performs no render itself.

## What it adds

The prompt asks for front, left side, right side and back views, full figure and details, keeping the same person and clothes as the reference. It includes present appearance fields and adds a row of faces showing **joy, anger, sadness, fear, surprise and a neutral look**.

The override applies only to character sheets with that editing model. For other targets it supplies no prompt; the generic [fo-prompts](../fo-prompts/) writer supplies the defaults it supports.

## Switch the override on or off

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-gpt-expressions** in **Settings → Plugins**. Keep **fo-prompts** on if you want its generic default when this override is off.
2. Open **fo-gpt-expressions** there and turn its **On** switch on.
3. On an editable character with a reference image and no prompt of its own, open **Render** from **Sheets** and choose GPT Image 2.5 editing under **Model**. Inspect **Default prompt**: it includes the row of facial expressions. The [model picker](../fo-model-picker/) uses this editing model for Draft and Final image edits on fal.
4. To return to the generic sheet prompt, turn the same switch off in **Settings → Plugins**, then reopen the render popup. With **fo-prompts** still on, its default asks for the four views and details without adding the expressions row.

You can compare the default text without starting a render. Your own existing or edited **Your prompt** takes precedence over a default. Inspect the chosen model, provider and price before pressing **Render**; the writer does not configure or pay for that provider.
