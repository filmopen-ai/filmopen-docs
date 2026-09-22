---
title: "Character Transformation"
description: "Apply written or transcribed changes to existing character JSON."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/character-transformation.md
sidebar:
  order: 1
---

The adapter receives existing character JSON and user instructions, then returns validated changes without replacing identity, reference media or provider bindings. The temporary host can fork a new version and open Compare with the result on the left.

An adapter belongs to this type because of its document contract, not merely because it calls a text model. Location or script transformation will need distinct document contracts and type pages when implemented.

## Subtypes

- Character JSON + instructions to revised character JSON — implemented

## Plugins

- [fo-openai-character](../../fo-openai-character/)

[All types of plugins](../)

