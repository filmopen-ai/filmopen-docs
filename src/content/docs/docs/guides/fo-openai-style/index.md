---
title: "Visual style with GPT-6 Astra"
description: "Analyze photographic treatment and save project defaults or folder overrides."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-openai-style/index.md
sidebar:
  order: 1
---

Plugin type: [Style Analysis](../plugin-types/style-analysis/).

Describe a photograph's visual treatment independently of its subjects. This adapter uses GPT-6 Astra through [fo-openai](../fo-openai/), with a schema for mood, palette, grading, film/camera-like appearance, lighting and a style prompt.

## Set up and analyze

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-openai** and **fo-openai-style**. Save the app's OpenAI key and grant the connector access.
2. Open a project or script folder you can edit. In **Reference images**, use the add control and **Upload** a PNG or JPEG.
3. Under the references, choose the style analyzer where several are available. Check **Picture to describe**: the most recent compatible upload is the default, and you can select another.
4. Press **Analyze** once. Review the **Visual treatment** fields and **What one picture cannot tell** limitations.
5. On a folder, inspect inherited values and their source. **Clear local overrides** removes the folder's own treatment while retaining its reference images.
6. Open a render at that project/folder's scope or a descendant. Review **The film's treatment** and **The film's treatment: what to avoid** before submitting. Edits inside that render dialog apply only to that render.

Analysis is a paid provider request; uploading alone is not. A useful test is to set a project treatment, override one field in a folder, then clear that override and check inheritance returns.

## What is saved

The canonical project/folder field is `visual_style`. It describes treatment, including mood, medium, palette, grain, halation, contrast, saturation, sharpness, vignette, temperature bias, lens/camera-like appearance, depth of field, lighting, composition, texture, grading and positive/negative prompt text.

Missing leaves inherit. Local values override inherited leaves, and arrays replace rather than append. A project supplies defaults; enclosing folders supply progressively more specific values. An explicit scene Style and a render's own values are applied at the relevant render context. Ambiguous folder parentage is reported instead of guessing.

The app resolves this treatment when preparing a render. Its prompt text is shown in the dialog and joined to the image prompt; it is no longer only a lab preview. A field cleared inside one render does not erase the project or folder's stored profile.

## Interpretation, privacy and cost

The analyzer excludes people, objects, locations and story. A photograph cannot reliably establish exact camera hardware, focal length, aperture, film stock or a LUT. The result describes visible resemblance, not a calibrated grade. Review it before using it.

Only validated style leaves are applied. Unknown observations preserve existing values; invalid tokens or palette colors reject the result. Identity, children, delivery settings and other fields remain unchanged. A stale result is not applied to another version.

Descriptions follow the app language; JSON keys and enums are stable. Usage records available tokens, a receipt and a price-based estimate. A rejected paid result can still cost money. No paid request is automatically repeated, and logs must not contain image bytes or generated descriptions.

[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [image inputs](https://developers.openai.com/api/docs/guides/images-vision).
