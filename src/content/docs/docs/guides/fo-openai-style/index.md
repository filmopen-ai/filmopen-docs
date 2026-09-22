---
title: "Visual style with GPT-6 Astra"
description: "Analyze photographic treatment and save project defaults or folder overrides."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-style/index.md
sidebar:
  order: 1
---

**fo-openai-style** extracts visual treatment from a reference photo. It is a separate adapter from character analysis, with its own strict JSON schema and prompt, using the saved OpenAI key through **fo-openai**.

Plugin type: [Style Analysis](../plugin-types/style-analysis/).

## Use in the temporary app

1. Enable **fo-openai** and **fo-openai-style**. Save and verify the OpenAI key in Provider keys and grant the connector permission to use it.
2. Open a project or script folder in **Edit**. In Reference images, upload a PNG or JPEG using the ordinary media uploader.
3. Select **GPT-6 Astra** in the style analyzer and choose **Analyze**. It sends the most recently uploaded reference image, not an arbitrary thumbnail.
4. Review the editable **Visual style** fields, the reusable positive/negative prompt and the reported limitations.
5. Expand **Effective visual style** to see the value used by the inheritance preview and its project/folder source. **Clear local style overrides** restores inheritance while retaining uploaded media.

These controls require the opt-in plugin-lab app branch/build. Installing the plugin does not add them to the canonical application. An enabled, permitted key and an owned uploaded image are required before analysis can run.

## What the JSON contains

The adapter returns description, mood, medium, stock-like appearance, grain, halation, contrast, saturation, sharpness, vignette, a representative palette, temperature bias, lens character, apparent depth of field, camera-like appearance, lighting, composition, texture, shadow/midtone/highlight grading descriptions and a style-only generation prompt.

It excludes people, objects, locations and story. Unknown observations are nullable and do not overwrite existing values. The schema and host both reject extra fields, invalid palette colors and translated enum tokens before applying any result.

A single photo does not establish its exact camera body, lens focal length, aperture, film stock or LUT. Camera/stock descriptions are resemblances, and limitations remain visible beside the analysis. Colors are approximate appearance observations, not calibrated measurements or an executable color transform.

## Project defaults and folder overrides

The proposed `visualStyle` object reuses the format's Style vocabulary plus descriptive extensions. The temporary preview merges project → enclosing folders → local profile, leaf by leaf. Omitted fields inherit; arrays replace; local values win. This changes the selected file only, never every child file. Ambiguous folder parentage is flagged rather than arbitrarily chosen.

The current canonical specification does not yet define project style profiles or folder style cascading. This is an explicit app handoff proposal. The temporary preview does **not** silently change production scene rendering or delivery settings. The app agent must bind the resolved style to a specific render context and settle its priority relative to explicit scene/style selections.

## Language, privacy and usage

English and Spanish interface labels use translation tokens. The model always receives English instructions and the JSON schema; prose and prompts follow the UI language, while keys/enums stay stable.

The host reads only bounded PNG/JPEG bytes already owned by the selected project/folder. The image is sent to OpenAI for the requested analysis. Prompts and image bytes are not written to plugin logs. Only validated style leaves are saved; identity, children, delivery format and unrelated extensions are preserved. Cancelled or stale responses are ignored by the editor.

The normal Usage ledger records measured tokens, a request receipt and an **estimated** USD cost at published model rates. Rejected paid outputs can still cost money. The plugin does not retry paid requests automatically or claim its estimate is a final invoice.

Source and milestone 1-13: [filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins).
Provider: [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) and [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

