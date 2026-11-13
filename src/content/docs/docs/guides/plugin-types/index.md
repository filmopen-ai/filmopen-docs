---
title: "Types of Plugins"
description: "Plugin capabilities, their subtypes, and the packages that implement them."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/index.md
sidebar:
  label: Overview
  order: 0
---

A **type** describes what a plugin does. A **subtype** describes its input/output mode. A package can implement more than one type, and one type can have adapters for several models or backends.

| Type | Current packages |
|---|---|
| [Image Generation](./image-generation/) | [fo-atlascloud](/docs/platforms/atlascloud/), [fo-cui](/docs/platforms/comfyui/), [fo-fal](/docs/platforms/fal/), [fo-google](/docs/platforms/google/), [fo-openai](/docs/platforms/openai/), [fo-wan2gp](/docs/platforms/wan2gp/) |
| [Video Generation](./video-generation/) | [fo-atlascloud](/docs/platforms/atlascloud/), [fo-cui](/docs/platforms/comfyui/), [fo-fal](/docs/platforms/fal/), [fo-wan2gp](/docs/platforms/wan2gp/) |
| [Character Analysis](./character-analysis/) | [fo-openai](/docs/platforms/openai/) |
| [Voice Analysis](./voice-analysis/) | [fo-fal](/docs/platforms/fal/) |
| [Style Analysis](./style-analysis/) | [fo-openai](/docs/platforms/openai/) |
| [Voice Generation](./voice-generation/) | [fo-elevenlabs](/docs/platforms/elevenlabs/), [fo-fal](/docs/platforms/fal/) |
| [Speech Synthesis](./speech-synthesis/) | [fo-elevenlabs](/docs/platforms/elevenlabs/), [fo-fal](/docs/platforms/fal/) |
| [Platform Connectors](./platform-connectors/) | [fo-anthropic](/docs/platforms/anthropic/), [fo-atlascloud](/docs/platforms/atlascloud/), [fo-cui](/docs/platforms/comfyui/), [fo-fal](/docs/platforms/fal/), [fo-google](/docs/platforms/google/), [fo-openai](/docs/platforms/openai/), [fo-openrouter](/docs/platforms/openrouter/), [fo-wan2gp](/docs/platforms/wan2gp/), [fo-xai](/docs/platforms/xai/) |
| [Server Providers](./server-providers/) | [fo-salad](/docs/platforms/salad/) |
| [Assistants](./assistants/) | [fo-assistant](../fo-assistant/) |
| [Model Pickers](./model-pickers/) | [fo-model-picker](../fo-model-picker/) |
| [Prompt Writers](./prompt-writers/) | [fo-prompts](../fo-prompts/) |
| [Prompt Builders](./prompt-builders/) | [fo-styles](../fo-styles/) |
| [Script Writers](./script-writers/) | [fo-parse-script](../fo-parse-script/), [fo-script-aid](../fo-script-aid/), [fo-script-aid-lite](../fo-script-aid-lite/) |

Each type page lists implemented and planned subtypes separately. The [package index](../plugin-packages/) gives installation steps; individual guides explain the permanent milestone 6-9 controls, requirements and remaining limitations. Older app builds may not have these controls. Installing a package does not supply a missing application feature.

## Keep the catalog complete

For every new package, create its guide, or its platform page where it owns a platform, register all of its types in `src/data/plugin-types.json`, link this index to any new type page, and add links in both directions between the type page and package guide (a plug-in that owns a platform is documented on its platform page, under **List of plugins → Platforms**). A new JSON document contract gets a distinct type when implemented; a second model for an existing contract usually does not.

The `plugin-types` documentation test checks every `fo-*` guide and platform page, each registered type and all package/type links. Plugin authors must also compare the shipping inventory in filmopen-plugins with this catalog when adding a package. Generated specification snapshots are not edited for this workflow.
