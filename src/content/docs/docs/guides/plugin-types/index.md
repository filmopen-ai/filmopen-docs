---
title: "Types of plugins"
description: "Plugin capabilities, their subtypes, and the packages that implement them."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/index.md
sidebar:
  order: 0
---

A **type** describes what a plugin does. A **subtype** describes its input/output mode. A package can implement more than one type, and one type can have adapters for several models or backends.

| Type | Current packages |
|---|---|
| [Image Generation](./image-generation/) | [fo-cui-zimage](../fo-cui-zimage/), [fo-fal-zimage](../fo-fal-zimage/), [fo-openai-gptimage25](../fo-openai-gptimage25/), [fo-fal-gptimage25](../fo-fal-gptimage25/) |
| [Video Generation](./video-generation/) | [fo-cui-ltx](../fo-cui-ltx/) |
| [Character Analysis](./character-analysis/) | [fo-openai-vision](../fo-openai-vision/) |
| [Voice Analysis](./voice-analysis/) | [fo-fal-voice](../fo-fal-voice/) |
| [Style Analysis](./style-analysis/) | [fo-openai-style](../fo-openai-style/) |
| [Character Transformation](./character-transformation/) | [fo-openai-character](../fo-openai-character/) |
| [Voice Generation](./voice-generation/) | [fo-elevenlabs](../fo-elevenlabs/) |
| [Speech Synthesis](./speech-synthesis/) | [fo-elevenlabs](../fo-elevenlabs/) |
| [Platform Connectors](./platform-connectors/) | [fo-cui](../fo-cui/), [fo-fal](../fo-fal/), [fo-openai](../fo-openai/), [fo-openrouter](../fo-openrouter/) |
| [Server Providers](./server-providers/) | [fo-salad](../fo-salad/) |
| [Assistants](./assistants/) | [fo-assist](../fo-assist/) |

Each type page lists implemented and planned subtypes separately. The [package index](../plugin-packages/) and individual guides describe requirements and integration status. Several controls are temporary plugin-lab proposals; installing a package does not add them to a normal app build.

## Keep the catalog complete

For every new package, create its guide, register all of its types in `src/data/plugin-types.json`, link this index to any new type page, and add links in both directions between the type page and package guide. A new JSON document contract gets a distinct type when implemented; a second model for an existing contract usually does not.

The `plugin-types` documentation test checks every `fo-*` guide, each registered type and all package/type links. Plugin authors must also compare the shipping inventory in filmopen-plugins with this catalog when adding a package. Generated specification snapshots are not edited for this workflow.

