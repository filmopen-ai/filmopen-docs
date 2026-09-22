---
title: "fo-fal: fal platform"
description: "A separate fal key, queue transport, pricing and receipt-scoped billing."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-fal/index.md
sidebar:
  label: fo-fal
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).


Enable **fo-fal** and allow its permissions. Its declaration adds a **fal key** input in FilmOpen's existing Provider keys UI. Saving verifies the credential and stores it using the host's credential store. Model plugins never receive the secret.

Enable a model adapter separately: [Z-Image Turbo](../fo-fal-zimage/) or [GPT Image 2.5](../fo-fal-gptimage25/).

| Function | Purpose |
|---|---|
| `availability` | Local stored/allowed-key check, without network traffic |
| `status` | Read-only authenticated service check |
| `request` | Relative request through the keyed fal connection |
| `run` | Submit once, validate receipt URLs, poll and retrieve the result |
| `pricing` | Read the selected endpoint's USD unit price |
| `billing` | Find a final charge for one endpoint and request ID |

Queue receipt URLs are constrained to the expected HTTPS fal queue host and exact request ID. The default polling budget is five minutes, configurable up to eight minutes, subject to host call limits. Pending polls do not submit additional jobs. A lost submission response or exhausted wait remains uncertain; inspect the saved receipt before retrying manually. `lastJob` is diagnostic storage, not a durable scheduler.

Billing lookup is separate from rendering. Some fal keys can render but cannot read administrative billing events. In that case a model adapter can record an estimated cost with its receipt; it must not report that as a confirmed debit. Zero is retained when the provider actually reports zero. Pricing endpoints describe rates, not necessarily a completed job's final charge.

The platform has no proposed shareable operation. Future sharing exposes bounded model operations through the host/relay, never raw HTTP access or credentials.

Provider documentation: [fal APIs](https://docs.fal.ai/), [FilmOpen fal platform guide](/docs/platforms/fal/).
