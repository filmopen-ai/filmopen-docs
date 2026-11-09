---
title: "FilmOpen plugin packages"
description: "Platform, model and assistant packages and their integration status."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-packages/index.md
sidebar:
  label: plugin-packages
  order: 1
---

Browse **[Types of plugins](../plugin-types/)** for capabilities and subtypes.

Platform packages own connections and credentials. Model adapters own workflows or API mappings. FilmOpen owns consent, credential storage, render jobs, media insertion and the Usage ledger. A package's `minRevision` says which interface revision its release requires; use a compatible desktop build.


These instructions describe the permanent controls added for application milestone 6-9. An older app may not have them. The procedures are setup and acceptance steps, not a claim that every provider has passed a new live test on your machine. Model availability, balances, downloaded files and provider permissions still need checking.

## Install and allow

1. Open **Settings → Plugins**. Use **Install from file…** for a packaged plugin, or put its complete folder in your shared library's `plugins` directory. Keep the manifest, JavaScript, assets, platform files and translations together.
2. For a source checkout, use **Settings → General → About → Plug-ins in development** and select the repository root whose immediate subfolders are `fo-cui`, `fo-fal` and the other packages. Do not select the parent of that repository or a single package folder. This development source takes precedence over library copies.
3. Open each required package, choose **Allow** and review its requested permissions. For a model adapter that uses a separate connector, enable both packages; fo-fal renders its catalogue-marked image models itself. A changed package asks for permission again.
4. Configure connections on the package page. Enter a provider key on the plug-in's own page, under **Settings → Plugins**. A plugin borrowing another owner's key also needs its **Keys** checkbox enabled. Keys stay in the host credential store.
5. Use **Check** under **Can it work?**, then follow the package guide's small test. Check tests readiness; it is not a render button. File downloads and voice saves are separate explicit operations too.
6. Where the package declares a documentation route, **Docs** on its plugin page opens its guide. Development builds use `docs.dev.filmopen.ai`; release builds use `docs.filmopen.ai`.

For generation, open a writable character in **Edit**, find the relevant media group and use its add control. **Upload** imports a local file; **Render** opens model options. **Voice** under **Voice samples** designs auditions. **Add a place…** exposes a media group that is not shown yet, such as **Motion clips**. A read-only version must be made editable before adding or analyzing media.

## Packages

| Package | What it adds |
|---|---|
| [fo-assistant](../fo-assistant/) | The default assistant: questions, reviews and filled-in fields |
| [fo-script-aid](../fo-script-aid/) | A screenwriting team |
| [fo-script-aid-lite](../fo-script-aid-lite/) | A lighter writing room, one writer in five roles |
| [fo-parse-script](../fo-parse-script/) | Planned: refining an imported screenplay |
| [fo-model-picker](../fo-model-picker/) | Fixed model and route defaults for render kinds and stages |
| [fo-prompts](../fo-prompts/) | Default prompts for every kind of Prompt card |
| [fo-styles](../fo-styles/) | 50 visual treatment styles to add to a render's prompt |

The plug-ins that connect a platform are on [their platform's page](/docs/platforms/), one per platform.

After a test, open the resulting media or edited fields and check persistence and Usage. A success from a connection check, a mock provider or a package unit test is not proof of a completed real render. A provider may have charged a request even when its result failed validation or its response was lost; inspect its receipt before manually repeating it. No package's sharing proposal enables a live relay.

Automatic recovery of an in-flight render after the app closes, a timeout or a lost connection remains integration work. Keep FilmOpen open while a job runs, and inspect the provider's job or ComfyUI history before manually submitting again. A missing result in the app does not prove the remote job stopped or incurred no charge.

Source and tests: [filmopen-plugins repository](https://github.com/filmopen-ai/filmopen-plugins). For authoring, see the [plugin guide](../plugins/).
