---
title: "Character changes with GPT-6 Astra"
description: "Describe changes in English or Spanish and compare a revised character version."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-character/index.md
sidebar:
  label: fo-openai-character
  order: 1
---

**fo-openai-character** transforms an existing fictional character from written
instructions. It uses **OpenAI GPT-6 Astra** through the saved OpenAI API key.
“ChatGPT” is not a separate API model or a ChatGPT subscription credential. This
is a **temporary plugin-lab integration** pending adoption in the permanent app.

## Use

1. Enable `fo-openai` and `fo-openai-character`, save the OpenAI key in Provider
   keys, and grant `fo-openai` access to it.
2. Open a character in Edit and choose **Describe changes**.
3. Select the transformation plugin. **Fork to new character version and compare**
   is checked by default. Uncheck it to modify the current editable version.
4. Type or dictate a request, such as “Make her twenty years older, with gray
   hair, wrinkles and a more mature voice.” Then choose **Modify**.
5. A fork opens Compare with the new version on the **left** and the original
   on the **right**. Review the changes before generating new images or voices.

Modify requires instructions and a ready provider key. Cancel discards a late
result. Failed or stale results do not overwrite the character, and a response
with no changes does not create a new version. Installing this plugin alone does
not add the temporary controls to a normal app build.

## JSON and coherent edits

The provider receives character JSON, the user's instructions and English system
instructions. Strict structured output describes allowed leaf changes. The
plugin merges validated changes into the original JSON and returns a complete
character; the host validates it independently before saving.

Age, birthdate, appearance, voice descriptions and generation prompts can change
together. At the same story time, increasing age by twenty normally moves the
birth year back twenty years. Missing facts are not filled merely to complete
the schema. Changes affect the selected version/epoch, not every character file.

Identity, authorship, references, relationships, provider voice IDs and unknown
extensions survive unchanged. The app creates version IDs and provenance.
Changing a voice description does not regenerate its audio or change the saved
voice ID: use the voice-design workflow separately. Existing photographs and
rendered media also remain available.

## Language, costs and future adapters

Newly authored prose follows the instruction language or an explicit language
request. Spanish input can produce Spanish descriptions and prompts while JSON
keys and enums remain stable. Unrelated existing prose is preserved. Interface
labels and errors have English and Spanish ARB translations.

Each Modify request can incur a charge, including a response rejected as invalid.
The app's proposed usage bridge stores measured tokens, a request receipt and an
estimated dollar cost at published rates; it does not claim an invoice amount.
There are no automatic paid retries. Logs contain operation/receipt metadata,
not the character's descriptions or key. Interrupted billing reconciliation is
still production work.

This package is the first character/model adapter, not a claim that Astra is
best at every edit. Future Claude or other model adapters can expose the same
`transformCharacter` offer; other document types need their own validation.
The proposed completion intent asks the app to open its saved result in Compare
or Edit. Model text cannot select arbitrary files or navigation destinations.

Source and milestone 1-12: [filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins).
Provider references: [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
and [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
