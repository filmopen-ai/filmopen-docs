---
title: "Server Providers"
description: "Discover, deploy and manage rendering servers on demand."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/server-providers.md
sidebar:
  order: 1
---

A server provider returns available offers, prices and per-instance endpoints. Render requests choose a specific local or remote server instead of mutating one global ComfyUI connection, allowing independent jobs on different machines.

The Salad adapter includes deployment and shutdown-lease work described in its guide. Pricing, cold-start time, storage and runtime support depend on the provider and recipe. A plugin type listing is not a guarantee that a chosen GPU or model is currently available.

## Subtypes

- On-demand GPU ComfyUI server — experimental Salad implementation

## Plugins

- [fo-salad](../../fo-salad/)

[All types of plugins](../)

