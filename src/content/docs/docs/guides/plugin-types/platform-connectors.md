---
title: "Platform Connectors"
description: "Provide authenticated transport, discovery and reusable provider operations."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/platform-connectors.md
sidebar:
  order: 1
---

These packages expose reusable operations to model or document adapters. ComfyUI owns connection and workflow execution; fal owns queued requests and billing lookup; OpenAI uses its own key, entered on [its page](/docs/platforms/openai/#add-the-key-to-filmopen); OpenRouter exposes text completions.

The app owns credential storage, consent, network permissions and usage persistence. A separate platform layer is useful when several adapters share it. A single-platform package such as ElevenLabs can keep private API helpers with its functions without needing another installable connector.

## Subtypes

- ComfyUI workflow backend
- Cloud queue and billing backend
- Structured response / text completion backend

## Plugins

- [fo-anthropic](/docs/platforms/anthropic/)
- [fo-atlascloud](/docs/platforms/atlascloud/)
- [fo-cui](/docs/platforms/comfyui/)
- [fo-fal](/docs/platforms/fal/)
- [fo-google](/docs/platforms/google/)
- [fo-openai](/docs/platforms/openai/)
- [fo-openrouter](/docs/platforms/openrouter/)
- [fo-wan2gp](/docs/platforms/wan2gp/)
- [fo-xai](/docs/platforms/xai/)

[All types of plugins](../)
