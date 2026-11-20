---
title: "Prompt Writers"
description: "Build editable default prompts from a template or a text model."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/prompt-writers.md
sidebar:
  order: 1
---

Prompt writers prepare editable default words for a render. A template writer, such as Basic, fills a template from the project's fields on your computer, with no key or network call. A model writer, such as Smart, sends the project's content to a text model and may cost money. Rendering uses the separately configured model and provider.

## Subtypes

- Template writer: Basic, and Turnaround, Face, Full detail and Expressions for character sheets — implemented
- Model writer: Smart — implemented

## Plugins

- [fo-prompts](../../fo-prompts/)

[All types of plugins](../)
