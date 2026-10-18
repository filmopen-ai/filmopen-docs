---
title: "Prompt Writers"
description: "Build editable default prompts from character appearance."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/prompt-writers.md
sidebar:
  order: 1
---

Prompt writers prepare editable default words for a render. The generic writer covers character reference images and sheets; a model-specific writer can override the sheet prompt to include expressions. These writers work locally without a key or network call. Rendering uses the separately configured model and provider.

## Subtypes

- Character to reference-image prompt — implemented
- Character to sheet prompt — implemented
- GPT Image 2.5 sheet with facial expressions — implemented

## Plugins

- [fo-prompts](../../fo-prompts/)
- [fo-gpt-expressions](../../fo-gpt-expressions/)

[All types of plugins](../)
