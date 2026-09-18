# FilmOpen plug-ins

A plug-in adds something to FilmOpen without a new build of the app: a rewrite of a scene, a platform to generate pictures on, a prompt builder. It is written for filmmakers who program a little, and for the AI coding agents they hand the work to. **If you are an agent:** read this file, then `filmopen-plugin.d.ts`, then `template/`, and change a copy of the template.

A plug-in is **one folder**: a manifest, one JavaScript file, and its strings. No build step, no packages, no framework.

```
plugins/
  filmopen-plugin.d.ts          what the app hands your code, as types
  template/                     the plug-in to copy
    pg_template_filmopen_v1.json    the manifest
    pg_template_filmopen_v1.js      the code
    l10n/en.arb                     the strings, one file per language
    l10n/es.arb
    README.md
  default-ai-assist/            the stock plug-in that speaks to OpenRouter and fal
```

## 1 Where plug-ins live

- **In the shared library**, `<library>/plugins/<tag>/`, beside every project on the computer. FilmOpen installs its stock plug-ins there and updates them with the app; this is where you drop your own. Settings → About shows where the library is.
- **In a project**, `<project>/plugins/<tag>/`: a plug-in that belongs to one film and travels with it. A project's plug-in is found before the library's.
- **In this repository**, `plugins/<tag>/`, for the stock plug-ins the app ships.

The folder's name is the plug-in's **tag**: lower-case letters, digits and dashes, at most 20 characters (`my-assist`). `app` is taken.

## 2 Make one

1. Copy `template/` to `plugins/<your-tag>/` in your library.
2. Rename both files to `pg_<your-tag>_<your-handle>_v1.json` and `.js` — your handle is the one in Settings → General.
3. In the manifest, set `tag`, `author` and `entry` to match the names.
4. Change the code and the strings. Keep `l10n/en.arb`: every plug-in needs English. Open FilmOpen: your plug-in is under Settings → Plugins, off until you allow it.

**Changing the stock plug-ins.** Do not edit a stock plug-in's files in place: FilmOpen replaces its own files when it updates. To change one for good, copy its folder under a new tag, as above. To try a variant, fork its manifest and code beside the stock ones (`pg_default-ai-assist_maria_v1.*`) and pick your version as you would pick a character's: it keeps the stock plug-in's keys and settings, since those belong to the tag.

## 3 The manifest

```json
{
  "filmopen": 1, "type": "pg", "tag": "template", "author": "filmopen", "v": 1,
  "name": "Template", "description": "description", "api": 1,
  "entry": "pg_template_filmopen_v1.js",
  "uses": ["default-ai-assist:openrouter"],
  "applies": ["sc"], "hooks": ["transform"],
  "settings": {
    "tone": { "type": "enum", "values": ["urgent", "quiet"], "default": "urgent", "label": "tone", "help": "tone.help" },
    "greeting": { "type": "string", "default": "", "scope": "machine", "label": "greeting" }
  },
  "entitySettings": { "sc": { "note": { "type": "text", "label": "note" } } },
  "actions": { "hello": { "label": "hello", "call": "hello" } }
}
```

| Field | What it says |
|---|---|
| `filmopen`, `type`, `tag`, `author`, `v` | the header every FilmOpen file has; `type` is `pg`, and they repeat the file's name |
| `name`, `description` | shown in the list; a string key of your `l10n` files, or the words themselves. Write `name` and `description` in English and use those words as their keys — without a colon, which no key may hold: the project tree and the plug-in's page show the manifest as written, and Settings → Plugins translates them |
| `api` | the version of this interface you wrote against: `1` |
| `entry` | the code file, beside the manifest |
| `l10n` | the folder of your strings; `l10n` unless you say otherwise |
| `keys` | the keys **your plug-in owns**: `{ "<slot>": { "platform": "<platform id>", "label": "…", "help": "…" } }`. Each becomes a card on Settings → Provider keys, under your plug-in's name |
| `uses` | keys of **other** plug-ins, or the app's, you ask to use: `"default-ai-assist:openrouter"`, `"app:openai"`. The person grants each on your plug-in's page |
| `provides` | `{ "platforms": { "<platform>": ["complete", "render", "estimateCost", "verifyKey"] } }`: the platform hooks you implement |
| `capabilities` | `"ai": true` for `ctx.ai.complete`; `"network": ["api.example.com"]` for hosts you reach **without** a key |
| `applies`, `hooks` | the entity types you work on (`sc`, `ch`, `lo`, …) and the entity hooks you implement (`transform`, `analyze`, `import`, `export`) |
| `settings` | your options (below) |
| `entitySettings` | fields kept in each entity's own file, per type named in `applies` |
| `actions` | buttons on your plug-in's page: `label` is a string key, `call` the function that runs |

**Nothing you declare can break FilmOpen.** A field, hook, setting type or action the app does not know — at the top of the manifest or inside a setting, a key or an action, such as a mistyped `defualt` — is reported on your plug-in's page and in the log, and left out; the rest of your plug-in still works. A file that is not UTF-8 text is reported the same way: save your files as UTF-8.

## 4 Settings, and where their values live

A setting is `{ "type", "default", "label", "help" }`, and `type` is one of:

| `type` | The box | Also |
|---|---|---|
| `string` | one line | |
| `text` | several lines | |
| `number` | a number | `min`, `max` |
| `boolean` | a switch | |
| `enum` | a pull-down | `values`: the tokens written; each value's words are the string `<setting>.<value>` |
| `model` | a pull-down of AI models | `category` (`llm`, `t2i`, `i2v`, …) and optionally `platform` |

The app draws every one of them itself — themed, translated, drivable by an agent — and saves it:

| Declared in | Where it is saved | So |
|---|---|---|
| `settings` (the default, `"scope": "project"`) | the project file, under `plugins.<tag>` | a film chooses its models, another version of the project can try other ones, and a collaborator sees the same |
| `settings` with `"scope": "machine"` | this computer only | a local server's address, a scratch prompt |
| `entitySettings` | the entity's own file, under `plugins.<tag>` | a character's version can carry other notes than its sibling |

A disabled or missing plug-in leaves its values alone: they stay in the files, under *Other attributes*.

## 5 The code

The file's last expression is the plug-in object; the app calls its functions by name with `ctx` and takes what they return:

```js
const plugin = {
  transform(ctx, { entities }) { /* return the entities, changed */ },
  async hello(ctx) { return { message: 'hello.answer', args: { name: ctx.settings.greeting } }; },
};
plugin;
```

The language is **ECMAScript 2020 in one file, with no `import`**. What exists: `JSON`, `Math`, `String`, `Number`, `Array`, `Object`, `RegExp`, `Map`, `Set`, `Promise` — and `ctx`. There is no `fetch`, no timers, no clock, no `eval`. Everything goes through `ctx`; `filmopen-plugin.d.ts` lists every member:

| | |
|---|---|
| `ctx.settings` | your settings, defaults applied |
| `ctx.l10n.t(key, args)` | a string in the person's language |
| `ctx.selection` | the entities the person chose (an entity hook also receives them as `args.entities`) |
| `ctx.project.get(stem)`, `.entities(type)`, `.resolve(type, tag, epoch)`, `.manifest()` | the film as the person sees it, one entity at a time |
| `ctx.keys()` | the keys you own or asked for: whether each is allowed, stored and checked — never a value |
| `ctx.http({ key, path, method, body })` | one request (below) |
| `ctx.ai.complete(messages)` | a text model, through whichever plug-in the person prefers for text |
| `ctx.sleep(ms)`, `ctx.signal`, `ctx.progress(fraction)` | waiting, cancelling, showing progress |
| `ctx.log(event, data)` | a line in the app's log |
| `ctx.storage.get(key)`, `.set(key, value)` | a little state of your own on this computer |
| `ctx.asset(name)` | a text file from your `assets/` folder |

**Hooks you can implement.** Entity hooks run on what the person chose: `transform` returns the entities rewritten, and FilmOpen writes them as **new versions under the person's handle and your tag** (`john123.template`, `v1`, then `v2` on the next run) — never over the person's own work; they compare it and copy what they like. Platform hooks run when a feature of the app needs a platform: `complete` (text), `render` (pictures, video, sound — return the output addresses and the app downloads them into the film's media), `estimateCost`, and `verifyKey` for a platform whose key check needs code. Each of `complete`, `render` and `estimateCost` is given the model's catalogue entry as `args.entry` beside its id: its `access` rows name each platform's own `model_id`, `variant` and `pricing`, so your code reads the platform's name for the model and its prices rather than keeping a list of its own (`default-ai-assist` shows how).

**Limits.** Each call runs alone, in a fresh engine: 30 seconds of JavaScript (waiting for a request or `ctx.sleep` does not count), 64 MB of memory, 10 minutes in all. Past a limit, or when your code throws, the call ends with the reason shown to the person; FilmOpen carries on.

## 6 Keys

**Your code never sees a key.** You name the key, and FilmOpen adds it to the request where the platform needs it:

```js
const answer = await ctx.http({
  key: 'default-ai-assist:openrouter',
  method: 'POST',
  path: '/chat/completions',
  body: { model: 'anthropic/claude-sonnet-5', messages },
});
if (answer.status !== 200) throw new Error(ctx.l10n.t('failed'));
return answer.json.choices[0].message.content;
```

- A key's id is `<owner>:<slot>`. The owner is the plug-in that declares it in `keys`; `app` owns the app's own (`app:openai`).
- The request goes to the key's platform, described by a platform file: `path` is added to its `base_url`, the credential goes in the header the file names, only over https, only to the file's `hosts`, following no redirect elsewhere. Anything else is refused.
- **Use a key another plug-in already has** by naming it in `uses` rather than declaring your own: the person types their OpenRouter key once, and grants it to your plug-in with one tick. Declare a key of your own only for a use nobody else covers — a second account, a client's budget.
- **A platform FilmOpen does not know** — a home ComfyUI, a new vendor — is one file, `platforms/<id>.json` in your plug-in's folder, in the shape of `assets/models/platforms/` in the FilmOpen repository (how a key is typed, checked and sent). A file for a platform the catalogue already has is ignored.

## 7 Strings

`l10n/<locale>.arb`, the same format as FilmOpen's own: `{"@@locale": "es", "hello": "Hola", "@hello": {"description": "The button"}}`. `en` is required. Placeholders are `{name}`.

- An unprefixed key is **yours**: `hello`. A key may not contain `:`.
- `app:<key>` borrows one of FilmOpen's own strings on purpose: `app:save`.
- A missing string shows its key, so you see what to add.

## 8 Trust

FilmOpen's own plug-ins (author `filmopen`) are on when installed. Any other plug-in — dropped into the library, installed from a zip, or arriving inside a project someone shared — is **off until the person allows it**, on a screen that lists the keys it declares and asks to use, the hosts it reaches, the entity types it reads and writes, and its settings. When its manifest or code changes, it is off again and asks again.

## 9 Share

A plug-in travels as a zip of its folder, `<tag>-<author>-v<n>.zip`. *Install from file…* on Settings → Plugins unpacks it into the library and shows the consent screen. Please publish your plug-in's source: FilmOpen is shared source, and a plug-in whose code people can read is one they can trust.

## 10 Try it

- **In the app:** Settings → Plugins → your plug-in → allow it, fill a setting, press an action; on a scene, *More* → *Plugins* runs your `transform`. The app's log (Settings → Logs) shows `plugin.<tag>.<event>` lines and any failure's code.
- **Through the MCP control**, as an agent does: every control of your plug-in has an identifier — `plugin:<tag>.<setting>`, `plugin:<tag>.action.<id>`, `field:<stem>:plugins.<tag>.<key>` — so `find plugin:<tag>`, `set_field`, `tap` and `log_tail` drive and check it. The FilmOpen repository's `packages/filmopen_mcp/README.md` says how.

## 11 Asking an AI agent to write one

Give it this folder and a sentence such as: *"Copy `plugins/template` to `plugins/scene-polish`, and make its transform ask the text model, through `default-ai-assist:openrouter`, to tighten each dialogue line; keep the setting and the strings in English and Spanish."* Everything the agent needs is in this README, `filmopen-plugin.d.ts` and the template.
