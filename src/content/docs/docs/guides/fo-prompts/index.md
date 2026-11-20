---
title: "fo-prompts: default prompts"
description: "Prepare editable default prompts for every kind of Prompt card, from a template or from your text model."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-prompts/index.md
sidebar:
  label: fo-prompts
  order: 1
---

Plugin types: [Prompt Writers](../plugin-types/prompt-writers/).

**fo-prompts v1** writes an English default prompt for each kind of Prompt card. It needs API 1, revision 1. You choose how it writes under **Writer**.

## Two ways of writing

- **Basic** fills a template from the fields of what you are rendering. It runs on your computer, with no key, no network and no call to a model, and costs nothing.
- **Smart** asks a text model to write the prompt, so it needs a text model you can use: your key, a program of your own, or [FilmOpen credit](/docs/platforms/). It **sends your film's content to that model and may cost money**: the thing you are writing for, its context, the project's own file (except for a treatment) and, for a frame or a clip, every block of its scene, the later ones included, though its instructions tell the model to use only those up to that point. Rendering afterwards is a separate use of the render model. Smart prefers, in order, Claude Sonnet 5, GPT-5.6 Terra, Grok 4.7 and Gemini 3.8 Flash.

| What the prompt is for | Writers |
|---|---|
| A character's reference image, a location's, an outfit's, a prop's | Basic, Smart |
| A location's, outfit's or prop's sheet | Basic, Smart |
| A character's sheet | Basic, Smart, Turnaround, Face, Full detail, Expressions |
| A shot's first frame or last frame, or its clip | Basic, Smart |
| A voice, a visual treatment | Basic, Smart |

**Turnaround**, **Face**, **Full detail** and **Expressions** are templates like Basic. **Expressions** adds a row of faces, and is offered only for GPT Image 2.5 editing.

## Use a default prompt

1. [Install and allow](../plugin-packages/#install-and-allow) **Prompt Writer** in **Settings → Plugins**.
2. Open something you can edit, and find its Prompt card, such as **First-frame prompt**. Choose under **Writer** and press **Generate**. On a version that isn't yours the card says **Read-only: edit your own version to write this prompt.**
3. The words appear on the card, with who wrote them and when. Inspect and edit them before rendering.

In the render dialog, a place that is checked for it has Render first replace the prompt's words with the stock writer: Smart where a text model is reachable, once you agree to its price, or Basic, free, where none is. What you type in the dialog goes under **Your prompt**.

## What it writes

Basic writes from each entity's own fields, its summary first; a missing field leaves nothing behind, clothing is not invented, and an empty source gives the template's fixed words alone. Smart follows the writer's instructions and the render model's notes, and writes for that model.

## If writing fails

The card says **Not generated ({code}).**, with the failure's code in place of `{code}`, or **Nothing generated: the writer had no prompt.** You can write the prompt yourself. A writing failure does not mean a render was sent.

**What is logged.** FilmOpen's log, on your computer, holds what the writer worked on as it is: the source and context it was handed, the prompt it wrote and, for Smart, the messages sent to the model and its answer. The key is never in it. If you share a log for troubleshooting, that content goes with it.
