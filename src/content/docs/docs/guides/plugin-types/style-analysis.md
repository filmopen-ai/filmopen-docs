---
title: "Style Analysis"
description: "Extract reusable visual treatment, independently of characters and locations."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/style-analysis.md
sidebar:
  order: 1
---

Style analysis covers mood, medium-like appearance, grading, palette, contrast, grain, halation, sharpness, vignette, apparent depth of field, lens character, lighting and a reusable style prompt. It excludes scene objects, people, places and story.

A photograph cannot reliably establish an exact camera, lens setting, film stock or LUT. The result describes visible resemblance and explicitly records limitations. It is not a calibrated grading transform.

The temporary app saves project defaults and folder overrides in a proposed visualStyle profile. Missing leaves inherit; local leaves override; arrays replace. Effective values and their sources are visible in the editor. Permanent format and render-context adoption remain app work.

## Subtypes

- Image to style JSON — implemented in the temporary plugin lab

## Plugins

- [fo-openai-style](../../fo-openai-style/)

[All types of plugins](../)

