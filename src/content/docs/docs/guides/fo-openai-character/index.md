---
title: "Character changes with GPT-6 Astra"
description: "Describe changes in English or Spanish and compare a revised character version."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-character/index.md
sidebar:
  label: fo-openai-character
  order: 1
---

Plugin types: [Character Transformation](../plugin-types/character-transformation/).

Describe changes to an existing fictional character and save a coherent revised version. This adapter uses GPT-6 Astra through the saved OpenAI API key; a ChatGPT subscription is not an API credential.

## Set up and modify

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** and **fo-openai-character**. Save the app's OpenAI key and grant the connector access.
2. Open your character in **Edit**, then choose **Describe changes**.
3. Choose the transformation plugin. Keep **Fork to a new version and compare** checked to preserve the original version; uncheck it to modify the current editable version.
4. Type or dictate a request, such as “Make her twenty years older, with gray hair, wrinkles and a more mature voice.”
5. Press **Modify** once. It requires a ready plugin and nonempty instructions.
6. For a fork, check Compare shows the new version on the left and the source version on the right. For an in-place change, review the revised fields and reopen the character to check persistence.

Dictation has its own provider/key requirements. Typing does not require a speech provider.

## What the change preserves

The provider receives the character JSON, the user's instructions and English system instructions. Structured output proposes permitted changes. The host validates and writes them together, preserving identity, authorship, references, provider voice IDs, unrelated fields and extensions.

Appearance, age/birthdate, voice descriptions and generation prompts can change together. Missing facts are not invented merely to fill the schema. A changed voice description does not regenerate audio or replace a saved voice ID; use the voice workflow separately.

A no-op response creates no new version. An invalid response or one made stale by a changed character is not applied. If a valid answer was kept but writing failed, **Write again** retries the local write without requesting another paid transformation.

## Test language and usage

Try a Spanish instruction and review the newly written descriptive text in Spanish. JSON keys and enum tokens remain stable; unrelated existing prose is preserved.

Inspect Usage after the request. Measured tokens and a price-based cost estimate are different from a provider invoice amount. A paid response rejected as invalid can still cost money, and no paid call is automatically repeated.

This is an adapter for character changes, not a claim that one model is best for every writing task. Logs should contain operation/receipt metadata rather than the character's private descriptions. [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
