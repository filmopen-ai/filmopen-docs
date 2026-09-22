---
title: "Platform Connectors"
description: "Provide authenticated transport, discovery and reusable provider operations."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/platform-connectors.md
sidebar:
  order: 1
---

These packages expose reusable operations to model or document adapters. ComfyUI owns connection and workflow execution; fal owns queued requests and billing lookup; OpenAI wraps the existing permitted app key; OpenRouter exposes text completions.

The app owns credential storage, consent, network permissions and usage persistence. A separate platform layer is useful when several adapters share it. A single-platform package such as ElevenLabs can keep private API helpers with its functions without needing another installable connector.

## Subtypes

- ComfyUI workflow backend
- Cloud queue and billing backend
- Structured response / text completion backend

## Plugins

- [fo-cui](../../fo-cui/)
- [fo-fal](../../fo-fal/)
- [fo-openai](../../fo-openai/)
- [fo-openrouter](../../fo-openrouter/)

[All types of plugins](../)

