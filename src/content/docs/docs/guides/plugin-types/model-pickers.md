---
title: "Model Pickers"
description: "Choose default models and routes for each render kind and stage."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/model-pickers.md
sidebar:
  order: 1
---

Model pickers supply defaults for a render kind and stage; FilmOpen validates availability and the route. They do not render or configure the provider. The current picker uses a fixed list of text, still-image, video and speech defaults; for the other render kinds it answers none, with a reason.

## Subtypes

- Render kind and stage to fixed model defaults — implemented

## Plugins

- [fo-model-picker](../../fo-model-picker/)

[All types of plugins](../)
