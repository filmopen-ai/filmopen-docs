---
title: "Character photo analysis with GPT-6 Astra"
description: "Turn a reference photo into editable character attributes and a generation prompt."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-vision/index.md
sidebar:
  label: fo-openai-vision
  order: 1
---

Plugin types: [Character Analysis](../plugin-types/character-analysis/).

Analyze a reference photograph into editable character appearance and a reusable generation prompt. The package uses GPT-6 Astra structured Responses through [fo-openai](../fo-openai/); it does not generate the replacement image.

## Set up and analyze

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** and **fo-openai-vision**. Save the app's OpenAI key and allow the connector to use it.
2. Create or open a character you can edit. In **Reference images**, use the add control and **Upload** a PNG or JPEG, at most 8 MiB.
3. Under the references, find **Described by**. When several image analyzers are on, choose the one you want.
4. Check **Picture to describe**. The most recent compatible upload is the default; choose another existing reference when needed. A generated take is not silently selected in place of the last upload.
5. Press **Analyze** once. Review the filled appearance fields, notes and prompt. Unknown observations leave existing values intact.
6. To test the full workflow, open **Render** from the reference-image add control. Choose an image generator, review the prompt and make a small image. Analysis and rendering are separate provider calls with separate costs.

The photograph is sent only when you choose Analyze; uploading it alone does not send it to this provider. If the app cannot establish a latest compatible upload, select the picture explicitly.

## What changes

The requested schema describes visible face, hair, eyes, complexion, clothing, accessories and posture, plus a reusable prompt. The host validates permitted paths and values before saving; clothing observations remain descriptive prose rather than invented wardrobe IDs.

The analyzer does not establish identity, ethnicity, biography, personality or exact physical measurements. Descriptions are approximate and editable. An invalid response changes nothing. A response that arrives after the reference or selected version is gone is not applied.

Character identity, unrelated fields, references and existing provider voice bindings remain intact. An analysis cannot recreate every visual detail through a later text-only render.

## Language, usage and failures

New descriptions follow the chosen app language; JSON keys and enum tokens remain stable. Test Spanish by switching the interface language before analysis and reviewing the descriptive output.

Usage retains available input/output token counts and a price-based estimate. Rejected JSON can still incur a provider charge. There is no automatic paid retry, and logs must not contain reference-image bytes or generated descriptions.

This guide describes current app controls and package expectations; live model access and output quality must be checked on the account being used. [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
