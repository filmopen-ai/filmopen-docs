# FilmOpen plug-ins

A plug-in adds something to FilmOpen without a new build of the app: a rewrite of a scene, a platform to generate pictures on, a prompt writer. It is written for filmmakers who program a little, and for the AI coding agents they hand the work to. **If you are an agent:** read this file, then `REFERENCE.md` and `filmopen-plugin.d.ts`, then `template/` in the plug-ins repository ([filmopen-ai/filmopen-plugins](https://github.com/filmopen-ai/filmopen-plugins)), and change a copy of the template.

A plug-in is **one folder**: a manifest, its code, and its strings. No build step, no packages, no framework.

```
plugins/
  filmopen-plugin-api.json      the interface definition: every shape, as data
  REFERENCE.md                  generated from it: every function and every member of ctx
  filmopen-plugin.d.ts          generated from it: the same, as types

filmopen-plugins/               the plug-ins repository: every plug-in FilmOpen ships, staged into each build
  template/                     the plug-in to copy
    pg_template_filmopen_v1.json    the manifest
    pg_template_filmopen_v1.js      the code (the last file is the plug-in)
    lib/greeting.js                 a second code file, loaded before it
    l10n/en.arb                     the strings, one file per language
    l10n/es.arb
    README.md
```

Everything that crosses between your code and the app is **JSON**: numbers, strings, booleans, null, arrays and plain objects. Nothing else survives — no `Date`, no `Map`, no class instance, no bytes.

**How to read this file.** Each thing the app exposes is marked **built**, with the milestone that built it, or **planned** — written down so that its shape can be argued with before it exists. **Nothing marked *planned* is callable**; a call to one fails as any unknown name does.

---

## 1 Where a plug-in lives

A plug-in is looked for in two places, **in this order**, and the first that has your tag is the one that runs:

| Where | The folder | What it is for |
|---|---|---|
| **The development folder** | any folder on this computer, named under *Plug-ins in development* on Settings → General's **About** card, one sub-folder per plug-in | the copy you are writing. It runs **from its own files**, with nothing copied anywhere, so you edit, call and read (5-2). **It is read one level deep** (5-2b): a sub-folder whose name is a tag and which holds that tag's manifest at its top is a plug-in, and any other — `docs`, `.git`, `node_modules` — is never read, so the folder may be a repository; a plug-in folder FilmOpen cannot read is named on the developer page with its path, and the others are there as before |
| **In the shared library** | `<library>/plugins/<tag>/`, beside every project on the computer | where FilmOpen installs its stock plug-ins, and where you drop your own. Settings → General's About card shows where the library is |

A project never supplies executable plug-ins. Its `plugins/` files are reported as *Other files*, and a `pg_` document in `data/` is data alone. One installed version of each plug-in runs, whatever the film — the stock author's highest, else the folder's highest — and a pick or an official pointer on a plug-in chooses nothing: to run another version, remove the package and install the one you want.

The `plugins/` folder of the FilmOpen repository is not a third place: it is the **bundle** the app installs into the library when it starts, which is why a stock plug-in's files are replaced there and why you copy one rather than edit it.

The folder's name is the plug-in's **tag**: lower-case letters, digits and dashes, at most 20 characters (`my-assist`). `app` is taken.

**Inside the folder**, beside the manifest and the code:

- `l10n/<locale>.arb` — your strings, `en` required (§12).
- `assets/` — the files your code reads with `ctx.asset(name)`, which are text: a ComfyUI workflow, a prompt, a table; and any other file your plug-in ships, such as a picture. A file is text when its bytes are valid UTF-8, and is installed as text; any other is installed as the bytes it is, and `ctx.asset` does not read it. **They are part of what a person consents to**, since a workflow runs on their computer as surely as your code does.
- `platforms/<id>.json` — a platform FilmOpen does not know (§9).

## 2 Make one

1. Copy the plug-ins repository's `template/` to a folder of your own — your development folder while you write it, your library when it is done.
2. Rename both files to `pg_<your-tag>_<your-handle>_v1.json` and `.js` — your handle is the one in Settings → General.
3. In the manifest, set `tag`, `author` and `entry` to match the names.
4. Change the code and the strings. Keep `l10n/en.arb`: every plug-in needs English.
5. Open FilmOpen: your plug-in is under Settings → Plugins, off until you allow it — and on the **plug-in developer page** (§14), where it runs without that question while you write it.

**Changing the stock plug-ins.** Do not edit a stock plug-in's files in place: FilmOpen replaces its own files when it starts. To change one for good, copy its folder under a new tag, as above. To try a variant, put your working copy of its folder, under the same tag, in the development folder: it is found before the library's and, once you allow it, runs in place of the stock one, keeping the stock plug-in's keys and settings, since those belong to the tag; take it out to go back. A fork picked beside the stock files does not run.

## 3 The roles, and the names

**A role is what your manifest provides, never a rule the app enforces**: one plug-in may play several, and `kind` is a word for lists and for a person reading (5-2).

| `kind` | What it is | What it holds | What it exposes |
|---|---|---|---|
| `platform` | the one plug-in that speaks to a service or a server — a renderer on your own machine, a vendor's API | the key (`keys`) or the address (a `server` setting); the service's protocol; **nothing about a model** | the **`platform` interface** (5-2b): `run({ model?, input, timeoutMs? })` and `request({ method?, path, query?, body? })`, which the contract lets another plug-in call — they are **not** offers, and may not be offered. It may implement `render` or `text` itself as well, where one shape fits every model |
| `model` | one model, or a family, on one platform | its workflows and prompts (`assets/`), and the handholding — which workflow for this much memory, which weights are missing; **no address and no key**: it `calls` its platform plug-in | the `render` or `text` interface for the entries it names in that interface's `models` |
| `tool` | works on the film's text: a prompt writer, a rewrite, an import | its settings and strings | the interfaces that work on entities (§7.1), and actions |

**Names.** A tag is a short name, at most 20 characters, as every tag of the format is — it is part of file names and of the handle your output is written under (`john123.<tag>`). FilmOpen's own plug-ins begin `fo-`; ComfyUI is `cui`. What a model plug-in serves is said by the `models` of the interface it implements (5-2b), since a catalogue entry's id does not always fit a tag. `app` stays reserved.

## 4 The manifest, field by field

```json
{
  "filmopen": 1, "type": "pg", "tag": "template", "author": "filmopen", "v": 1,
  "name": "Template", "description": "description", "api": 1,
  "kind": "tool",
  "entry": ["lib/greeting.js", "pg_template_filmopen_v1.js"],
  "l10n": "l10n",
  "uses": ["fo-openai:openai"],
  "offers": { "greet": { "label": "offers.greet", "example": { "name": "Kira" } } },
  "calls": ["template:greet"],
  "applies": ["sc"], "implements": { "transform": {} },
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
| `name`, `description` | shown in the list; a string key of your `l10n` files, or the words themselves. Write them in English and use those words as their keys — without a colon, which no key may hold |
| `docs` | optional guide path, for example `/docs/platforms/comfyui/`; nonempty slash-separated segments of letters, digits, hyphens or underscores below `/docs/`, with an optional trailing slash. No host, scheme, query, fragment, encoding, backslash, repeated slash or dot segment. FilmOpen chooses its development or release documentation site. An invalid field is reported and omitted without disabling the package |
| `api` | the version of this interface you wrote against: `1` |
| `kind` | `platform`, `model` or `tool` (§3). Optional, and it decides nothing (5-2) |
| `entry` | the code: a file name, **or a list of them in the order they are loaded** (5-2). Each is a `.js` file of your own folder, named by a relative path; at most 32 files and 2 MB in all |
| `l10n` | the folder of your strings; `l10n` unless you say otherwise |
| `keys` | the keys **your plug-in owns**: `{ "<slot>": { "platform": "<platform id>", "auth": "key \| oauth", "label": "…", "help": "…" } }`. Auth defaults to key. An OAuth slot uses its platform’s sibling OAuth block; its card calls host sign-in/sign-out directly, with no action declaration. A cleared record shows Sign in. Each becomes a card on the plug-in's own page, Settings → Plugins → &lt;plug-in&gt;, under your plug-in's name |
| `uses` | keys of **other** plug-ins, or the app's, you ask to use: `"other-plugin:fal"`, `"fo-openai:openai"`. The person grants each on your plug-in's page |
| `implements` | **the interfaces you implement** (5-2b): `{ "render": { "platform": "comfyui", "models": ["t2i-z-image-turbo"] }, "transform": {} }`. An interface is a named set of functions; `REFERENCE.md` lists every one with what it receives and answers, and what a manifest adds when it declares it — a `platform` for `render`, `text` and `key-check`, and optionally the catalogue entries you speak for. A render declaration may name a `program` setting and `programKinds` (default `["t2i"]`); configured programs admit those tags within `models` where listed, independently of render marks and upload permission. One platform to an interface; a second platform is a second plug-in |
| `minRevision` | the least `revision` of the interface your code needs (5-2b); the contract is revision 1, and none or 1 is the same. A FilmOpen with less says so on your page and does not run you; `ctx.api` tells your code what it has |
| `capabilities` | `"process": true` for the five `ctx.process` doors, which run a program the person chooses on this computer; `"ai": true` for `ctx.ai.complete`; `"network": ["api.example.com"]` for hosts you reach **without** a key; `"upload": true` if you would send the film's media to your platform or your server — settled and **not in this FilmOpen yet**, which your page says and `ctx.upload` answers |
| `applies` | the entity types you work on (`sc`, `ch`, `lo`, …): where your `transform`, `analyze` and `export` are offered, and what your `entitySettings` may name |
| `offers` | the functions **other plug-ins may call** (5-2): `{ "<name>": { "label": "…", "help": "…", "args": { … }, "returns": { … }, "example": { … } } }`. `label` is what the caller's consent screen shows; `args` and `returns` are schemas of the kind `REFERENCE.md` writes, and the developer page holds a call to them; `example` is a value of the arguments it takes, for a reader and for the developer page's box |
| `calls` | the functions of other plug-ins **you call** (5-2): `"<tag>:<name>"`. The person sees every one of them on your consent screen |
| `settings` | your options (§4.1) |
| `entitySettings` | fields kept in each entity's own file, per type named in `applies` |
| `sharing` | the operations you could offer to others, which lending offers and matches another computer's offers against: `{ "operations": [ { "function": "render" \| "speak", "model": "<catalogue id>", "unit": "image" \| "second" \| "character", "scale": 1000 } ] }`, `scale` only with `character`, an empty `operations` valid. The app reads it and reports a wrong shape at its path |
| `actions` | buttons on your plug-in's page: `label` is a string key, `call` the function that runs, and an optional `example` of the arguments that function takes — for a reader, and for the developer page's box (§14) |

**Nothing you declare can break FilmOpen.** A field, hook, setting type or action the app does not know — at the top of the manifest or inside a setting, a key or an action, such as a mistyped `defualt` — is reported on your plug-in's page and in the log, and left out; the rest of your plug-in still works. A file that is not UTF-8 text is reported the same way: save your files as UTF-8.

### 4.1 Settings, and where their values live

A setting is `{ "type", "default", "label", "help" }`, and `type` is one of:

| `type` | The box | Also |
|---|---|---|
| `string` | one line | |
| `text` | several lines | |
| `number` | a number | `min`, `max` |
| `boolean` | a switch | |
| `enum` | a pull-down | `values`: the tokens written; each value's words are the string `<setting>.<value>` |
| `model` | a pull-down of AI models | `category` (`llm`, `t2i`, `i2v`, …) and optionally `platform` |
| `server` | the address of a server the person runs or chooses (5-2, §10) | always kept on one computer, whatever `scope` says; not allowed under `entitySettings` |
| `program` | an executable path, with *Use this* for a path found on PATH | machine scope only; optional `names` without extensions; no default; not allowed under `entitySettings` |

A program path is permission to run that program as the person. Discovery resolves executable names with PATHEXT on Windows; finding a path stores nothing until the person accepts it or types one. A stored path that is no longer executable is marked on the card.

Declare `capabilities.process: true` to use program doors. Consent names every program setting and explains that the chosen program runs as the person, with their access. Without that capability, every process door is refused and logged before dispatch.

The five `ctx.process` doors keep a chosen program across calls. Start with `{setting, args, cwd?}`; without `cwd`, the private `process/<setting>/` folder stays the same across starts. Send `{setting, line, operation}` and receive `{setting, operation}`: the first send owns the program until `release({setting})`, so another operation is `busy`. Receive answers `{line}` or `{exited: true, code}` with no timeout, and Stop cancels its wait. Stderr is logged rather than received. `stop({setting, operation})` ends only that operation's process or an unowned process; another owner's is refused `busy`. Omitting `operation` ends the program and children; disable, a program-setting edit and application exit do too. The host logs all paths, arguments and lines whole. No crash is restarted automatically. Linux passes spaces and `&` intact without a shell; Windows `.cmd` invocation supports spaces, while `&` follows the shim's shell rules. When a call ends done, failed or stopped, the host stops any process still owned by that frame id across plug-ins and discards its queue, logging `ownerEnded`. Release before ending to keep the program alive. At 0 copies, a program render waits for the owned single process to end before taking a runner slot; its Stop cancels only the waiting job. A release wakes no pending wait.

Only the `operation` handed by the host to `complete` is automatically cleaned up: at turn handover, or `ownerEnded` for a frame. Any other function that sends must `release` in its own `finally`. `stop` releases ownership, so `release` on a stopped pair answers `notRunning`.

Text `complete` receives the frozen host-selected `route` (`funding` and its `slot`, `program` or `key`) and `operation`, the assistant's session id or the calling frame id. An owned operation at turn end hands over once to optional `interrupt(ctx, {operation})`, also after failure, refusal or staleness and during finalization. Consume the program's terminal line and return `{usage, account?}`. A program’s `account.label` identifies its account and plan from that same answer stream; complete and interrupt report only the tokens since their previous answer, with no extra status call. The host records it on a fresh root ledger and releases ownership; a successful Stop keeps the program alive. Missing or failed interrupts, including their ordinary wall expiry, end the owned process and discard its queued output. There is no repeat-Stop seam. Every root or nested `complete` has no wall-clock cap; `interrupt` and all other functions keep their ordinary wall. Stop still cancels completion, and cumulative JavaScript time, memory, stack, result size and cancellation grace still apply.

The app draws every one of them itself — themed, translated, drivable by an agent — and saves it:

| Declared in | Where it is saved | So |
|---|---|---|
| `settings` (the default, `"scope": "project"`) | the project file, under `plugins.<tag>` | a film chooses its models, another version of the project can try other ones, and a collaborator sees the same |
| `settings` with `"scope": "machine"` | this computer only | a local server's address, a scratch prompt |
| `entitySettings` | the entity's own file, under `plugins.<tag>` | a character's version can carry other notes than its sibling |

A disabled or missing plug-in leaves its values alone: they stay in the files, under *Other attributes*.

## 5 The code

The **last** file's last expression is the plug-in object; the app calls its functions by name with `ctx` and takes what they return:

```js
const plugin = {
  transform(ctx, { entities }) { /* return the entities, changed */ },
  async hello(ctx) { return { message: 'hello.answer', args: { name: ctx.settings.greeting } }; },
};
plugin;
```

The language is **ECMAScript 2020, with no `import` and no `require`**. Several files are loaded in the order `entry` names them, **into one scope**: what an earlier file declares at its top is there for a later one (5-2). What exists: `JSON`, `Math`, `String`, `Number`, `Array`, `Object`, `RegExp`, `Map`, `Set`, `Promise` — and `ctx`. There is no `fetch`, no timers, no clock, no `eval`, and no `Math.random`: a render's seed comes from the app (§7.3).

**Where an error is.** A failure carries the **file, the line and the column** it was thrown at, under the names your `entry` gives (5-2) — on the plug-in's page, in `last-run.json`, and on the developer page (§14).

*Planned:* `import` between your own files (ES modules), should plain scripts in order prove too little.

## 6 What the app exposes: every member of `ctx`

**The shapes are in `REFERENCE.md`**, which is generated from the interface definition
(`filmopen-plugin-api.json`) and is where each member's arguments and answer are written; this table
says what each is for.

| Member | What it does | State |
|---|---|---|
| `ctx.api` | `{ api, revision }`: what this FilmOpen has of the interface. Ask for a function or a door that arrived later only where `revision` says it is there | built 5-2b |
| `ctx.plugin` | `{ tag, author, v, stem }`: which plug-in version is running | built 5.1 |
| `ctx.settings` | your settings, defaults applied — the film's from the project file, this computer's from this computer | built 5.1 |
| `ctx.selection` | the entities the person chose; an entity hook also receives them as `args.entities` | built 5.1 |
| `ctx.caller` | `{ tag, stem }` — who asked, where **a plug-in** asked; **null** when the app or the person started the call | built 5-2; `stem`, and `null` where it was absent, 5-2b |
| `ctx.l10n.t(key, args?)` | a string in the person's language (§12) | built 5.1 |
| `ctx.project.get(stem)` | one file by its stem, `sc_5_john123_v1`; null when there is none | built 5.1 |
| `ctx.project.entities(type)` | every entity of a type, as it resolves for the person | built 5.1 |
| `ctx.project.resolve(type, tag, epoch?)` | the version in use of an entity; null when nothing resolves | built 5.1 |
| `ctx.project.manifest()` | the project's own manifest | built 5.1 |
| `ctx.project.script()` | the film's script as the person sees it: the rows of the app's own walk, in order, flags and all | built 5-2 |
| `ctx.project.scopes()` | the scopes `export` takes, `[ { name, description, arg } ]` (§6.1) | **built** |
| `ctx.project.export(scope, arg?, options?)` | the film as the person sees it, flat, as one scope selects it — an exchange document; `options` carries nothing yet, and what it holds is ignored (§6.1) | **built** |
| `ctx.project.import(document, options?)` | proposes a document's changes to the person, who applies them in FilmOpen; answers the plan. `options` is `{ base?, dryRun? }` (§6.1) | **built** |
| `ctx.keys()` | the keys you own or asked for: whether each is allowed, stored and checked — **never a value** — and `usable`, `mode` and `reason`: ask `usable`, never `hasKey`. Today `mode` is `own` and `usable` is a key stored and allowed, `reason` `needsKey` or `grantDenied` where it is not; answers through the person's FilmOpen account (`funded`) come later | built 5.1 |
| `ctx.signIn({key})` | sign in to the plug-in's own `auth: oauth` slot from a settings action; answers account and expiry, never tokens | **built** |
| `ctx.signOut({key})` | revoke the owned OAuth slot from a settings action; only HTTP 200 removes its credential and key record | **built** |
| `ctx.http(request)` | one request: with a key (§9), on a person's server (§10), or to a host in `capabilities.network` | built 5.1; `server` 5-2 |
| `ctx.http.read()` | the next events of the call's one open event stream, which `ctx.http` answered with `stream: true`: `{ events, done }` (§7.2, *Streaming a text answer*) | **built** |
| `ctx.ai.complete(messages, options?)` | the LLM decided for the call that made it: the assistant turn's frozen decision, else the call frame's, else one captured for the call; the global *Use the LLM:* choice overrides plug-in preferences. `options` holds `params` and `llms`, catalogue ids in order for this completion unless the assistant has a frozen route; a per-call choice never replaces the step default. The answer names its `model` and `provider`. None reachable is refused `noProvider` with the reason; the decision never changes mid-call | built 5.1 |
| `ctx.process.start({setting, args, cwd?, operation?, tools?})` | starts the chosen program and answers `{already: false, pid, cwd}`, or `{already: true}` when it runs; omitted `cwd` uses its stable private folder, returned for the program's protocol. In an assistant `complete`, `tools: true` also returns `tools: {url}` for its MCP relay; use `Bearer <filmopen-tools-token>` in that server's authorization header, injected after logging. Elsewhere it is `badArgs/tools`. Requires `capabilities.process: true` and an explicitly chosen program path | built |
| `ctx.process.send({setting, line, operation})` | sends one whole line; the first send owns the program for this operation, another operation refused `busy` until release. A JSON `{filmopen: "tools/result", id, success, content}` answers a relay call, never stdin; an ended call is `refused/unknownId` | built |
| `ctx.process.receive({setting, operation})` | waits for `{line}` or `{exited: true, code}` without a timeout; Stop cancels this wait. Stderr goes to the log. The assistant relay also queues `{filmopen: "tools/call", id, name, arguments}` with a string FilmOpen id; the HTTP id stays with its response. Turn end answers pending calls once as errors, drops queued calls and voids the bearer; a JS yield keeps it live | built |
| `ctx.process.stop({setting, operation?})` | closes stdin and stops the program and its owned children, discarding queued output; an operation stops only its own or an unowned process, another owner's refused `busy`; without an operation it stops the setting's processes | built |
| `ctx.process.release({setting})` | frees the operation's ownership while keeping the program running | built |
| `ctx.call(name, args?)` | a function another plug-in offers, `"<tag>:<name>"` (§11) | built 5-2 |
| `ctx.storage.get(key)` / `ctx.storage.set(key, value)` | a little state of your own on this computer, 256 KB in all | built 5.1 |
| `ctx.machine()` | this computer's OS, CPU, RAM and GPUs, read once per session; unread facts are `unknown`; no declaration | built |
| `ctx.asset(name)` | a text file from your `assets/` folder | built 5.1 |
| `ctx.sleep(ms)` | waits; throws when the call is cancelled. For polling a queue | built 5.1 |
| `ctx.signal` | `{ aborted, throwIfAborted() }`: whether the person cancelled | built 5.1 |
| `ctx.progress(fraction, key?, args?)` | progress shown in the app, 0 to 1, with an optional string key | built 5.1 |
| `ctx.partial(text)` | a piece of a streamed answer's visible text, awaited, during a `complete` asked with `stream` (§7.2) | **built** |
| `ctx.log(message, data?, level?)` | **any line of your own**, up to 200 characters, with any JSON beside it. **Every line also goes to the app's own log, whole**, wherever the call was started from: a message shaped like an **event name** — `[A-Za-z0-9_.-]`, at most 64 characters — as `plugin.<tag>.<event>`, any other as `plugin.<tag>.line` with your message as `text`; its data as given (§14). The app's log keeps everything, an answer as it came included: never log a key — your code names one and `ctx.http` adds it after the request is logged; an answer that echoes it comes back, and is logged, as the platform sent it. `level` is `debug`, `info`, `warning` or `error`, `info` when left out: **a `debug` line reaches the app's log only while *verbose logs* is on in Settings**, so a diagnostic costs nothing in ordinary use; any other value writes nothing | built 5.1; any text 5-2 |
| `ctx.now` | the app's clock when the call started, in milliseconds: the one time to reckon a quote's age, a lease or a deadline from | built 6-9 |
| `ctx.job` | `{ id, destination?, keyId? }`: the job the call belongs to — a render, its collect or its cancel, and every call they make — whose `id` your receipt of the work goes under; **null** for a call that belongs to no job | built 6-9 |
| `ctx.features` | `{ serverProviderV1? }`: what the app bridges for a plug-in; this FilmOpen bridges none and answers `{}`, and a server provider implements `server-provider`; a plug-in asks `ctx.api.revision` instead. No output is bridged: an inline image or sound goes through `ctx.stage` | built 6-9 |
| `ctx.upload(…)` | sending a first frame or a reference sound to a service that takes an upload, named by its descriptor's `grant`, or by its `media`; with `capabilities.upload` | built 6-9 |
| `ctx.stage(…)` | keeping exactly one of base64 or path behind `{ handle, mime, bytes }` for output-capable calls; inline image/audio retains its 16 MB bound; an absolute readable file path is program-only, streamed with signature checking and no output cap, for an image or `video/mp4` with `role: video`; an ended call keeps nothing | built 6-9 |

That is the whole of it: **a name `ctx` does not have is refused before it reaches the app**, whatever your code calls it. `ctx.l10n.t` also tells the app when a key is missing, so that Settings can show you which; nothing else of yours reaches the app on its own.

**A call that has ended** — cancelled, or past a limit — still answers `ctx.log` and `ctx.progress`, and nothing else: a request that would spend money, write something or wait is not started for a call that is over.

### 6.1 The exchange: `scopes`, `export` and `import`

Built: the shapes — `ExchangeDocument`, `ScopeInfo` and `ImportAnswer` in `REFERENCE.md` — and this FilmOpen answers the three doors. They speak **exchange 1** for as long as they exist; an incompatible encoding would come as new doors under new names.

**`export(scope, arg?, options?)`** answers the film as the person sees it — the versions they have in use, with no author and no version number — flat, as one scope selects it. The scopes are `all`, `project_overview`, `scene_with_context`, `location_usage`, `character_arc`, `folder_whole`, `character_lines`, `scene_dialogue` and `focus` (taking `{folders: [tags], scenes: [tags]}`); `scopes()` says what each takes. **`all` is the handover**: everything of the film, whole, and nothing of its history or opinion. **Nothing is anonymised**: names, handles, a media address or an e-mail somebody typed travel as content. **The person's notes** (`notes`, `creator_notes`) are content like any other key: they travel wherever a scope carries a file whole, and nothing asks. An answer above 8 MiB is refused `tooLarge`. FilmOpen keeps an export under its `export_id` for the call (the last four; one exported again counts once) or, under the assistant, for the operation, so that an import can name it as its `base`: a name, never a copy. `badArgs`/`base` is a name that is not a string or names no export kept for this call or operation.

**`import(document, options?)`** proposes; it never writes. FilmOpen plans the document against the versions in use and queues the proposal for the person, who reviews it and applies it; the answer is the plan — `state`, the `proposal`'s id, one change per file object with its `action`, the version it starts from (`target`), the paths it changes and removes, its notes and, where refused, its `problem`, and the document's own `notes` and `problems` — and never a document. `dryRun` plans without proposing. The request — the door's name, the document and the options — must be under the engine's 16 MiB. What happens when the person applies is shown to them in FilmOpen and never comes back to the plug-in; this FilmOpen holds a proposal from an ordinary call, but the window that shows it to the person is still to come. Where nobody may write — no username — the whole document is refused `noViewer`. **A code you do not know is a refusal, and a note kind you do not know is information**; both lists only grow.

What a file object of an import does to the version in use:

| In the patch | Effect |
|---|---|
| `"logline": "…"` | the leaf written |
| `"logline": null` | the leaf written as `null` |
| `"$remove": ["logline"]` | the key removed |
| `"appearance": { "hair": { "color": "gray" } }` | one leaf changed, the rest of `appearance` kept |
| `"appearance": {}` | nothing |
| `"$replace": ["appearance"], "appearance": {}` | `appearance` emptied |
| `"$replace": ["appearance"], "appearance": { … }, "$remove": ["appearance.hair"]` | refused, `conflicting_directives` |
| `"$remove": ["logline"], "logline": "…"` | refused, `conflicting_directives` |
| `"$replace": ["aliases"]` with no `aliases` | refused, `replace_without_value` |
| `"aliases": ["KIRA"]` | the list replaced |
| `"blocks": [ { "id": "bl_3", "dialogue": "…" } ]` | one block's dialogue changed; the others kept |
| `"blocks": [ { "dialogue": "…" } ]` | a new block at the end under the next number |
| `"blocks": [ { "id": "bl_2" }, { "dialogue": "…" } ]` | a new block after `bl_2` |
| `"$remove": ["blocks[id=bl_3]"]` | the block removed; `next_block` kept past it |
| `"$replace": ["blocks"], "blocks": [ … ]` | the script is exactly the list given, in that order |
| `"cast": [ { "character": "spouse", "epoch": "28yo" } ]` | the entry for `spouse` patched or added; the others kept |

Nothing is deleted but by `$remove` or `$replace`; the shared library is never written, and a version that is not the person's own is forked.

## 7 What a plug-in exposes

Every function is optional, and **the manifest says which the app may call** — with one exception: **`status` is asked of every plug-in** (5-2b), whatever it implements. It answers `{ state, account?, message?, details? }`, `state` being `ready`, `unconfigured` (the person has something to give you first), `unavailable` (what you need does not answer) or `degraded`; FilmOpen draws it as **Check** on your plug-in's page. **Answering it must start nothing, spend nothing and install nothing** — the app's own text model and a platform's `run` are refused inside it, and a `status` another plug-in calls is a check too — and a plug-in whose code has none is told so on its page and runs as before. All of these may be `async`.

### 7.1 The interfaces that work on entities — `transform`, `analyze`, `import`, `export`

They run on what the person chose in the tree, and receive it as `args.entities`.

| Hook | Arguments | Answers | State |
|---|---|---|---|
| `transform(ctx, { entities })` | the chosen entities, as they resolve for the person | the entities, changed | built 5.1 |
| `analyze(ctx, { entities })` | the same | any JSON, shown to the person | **planned** |
| `import(ctx, { file })` | `{ name, text }` | the entities to write, and optionally a batch | **planned** |
| `export(ctx, { entities })` | the chosen entities | `{ filename, content }` | **planned** |

`import` and `export` keep their names and their meaning — a foreign file in, a foreign file out, on a person's gesture. To read the film whole or propose changes to it, a plug-in uses the doors `ctx.project.export` and `ctx.project.import` (§6.1).

**What `transform` returns is written as new versions under the person's handle and your tag** (`john123.template`, `v1`, then `v2` on the next run) — never over the person's own work; they compare it and copy what they like.

### 7.2 The interfaces that reach a model — `render`, `text`, `key-check`, `platform`

They run when a feature of the app needs a platform. **The app chooses the plug-in by the model asked for** (5-2b): among the plug-ins on the platforms the model's entry names, one whose `models` names it before one that names none, then — where the request names no platform — a plug-in on the person's own computer before one that bills, and the person's preferred one among several still; without a preference the person is asked. A request may name its platform, and then no other is looked at. The choice is made once: **a render that fails is never sent to another plug-in**. `model` is a catalogue entry id, and `entry` is that entry's file as the catalogue holds it — its `access` rows name each platform's own `model_id`, `variant` and `pricing`, so your code reads the platform's name for the model and its prices rather than keeping a list of its own.

| Hook | Arguments | Answers | State |
|---|---|---|---|
| `complete(ctx, { operation, route?, model, entry?, messages, params, tools?, tool_choice?, stream? })` | a chat; `tools` and `tool_choice` given only to a provider that declares `"tools": true`, which may then answer `tool_calls`; `stream` below | `{ text, usage?, cost?, … }` (the app fills `model` and `provider` for `ctx.ai.complete`) | built 5.1; `stream`'s doors built |
| `render(ctx, { model, funding?, stage?, from?, entry?, prompt, inputs, params, seed, source?, stack?, destination?, quote? })` | §7.3; the last three §7.6; `stage` and `from`, which an adapter keeps | `{ state, outputs, … }`, §7.3 | built 5.1; its arguments 5-2; its answer by `state` 5-2b |
| `estimateCost(ctx, { operation, model, entry?, params, … })` | `operation` says which function the price is for, `render` or `complete` | a number of US dollars, or null | built 5.1; `operation` 5-2b |
| `verifyKey(ctx, { key })` | the id of the candidate key the person just typed, usable in `ctx.http` **for this call only** | `{ accepted, message? }` | built 5.1 |

`verifyKey` is never offered to another plug-in and never called from the developer page: it is the key check's own gate. The key it checks may only read — `GET` or `HEAD` — since a key check runs no model.

The global *Use the LLM:* setting chooses the model for text calls. With *Let the AI assistant decide*, the first reachable preferred model wins, else the first reachable text catalogue entry. Every serving provider is checked for a configured local server, stored-key status or cached credit before ranking; among the chosen model's reachable providers use the person's text-provider preference, else stock, else first by tag, logging a tie. A call keeps its decision, nested calls inherit it, and an unavailable override fails honestly without another model or provider being tried after a failed send.

**Streaming a text answer** (its two doors are built). The app may give `complete` `stream: true`, asking for the text as it arrives; a provider that does not stream ignores it and answers as before, and nothing in the manifest says which you do. One that streams asks its service for an event stream with `stream: true` on the request; a 2xx `text/event-stream` answer comes back at once with `stream: true` and no body, and anything else is answered whole as today. It then reads the events with `ctx.http.read()` — each read waits for at least one complete event, or the end, and hands every complete event that has arrived, its `data` with any credential taken out as from a whole answer — hands each piece of visible text to the app with `ctx.partial(text)`, awaited, and **still answers its whole result**, assembled from the events: whether the stream ended with the provider's own terminal event, and so whether the answer is complete, is yours to say.

```js
const response = await ctx.http({ key: 'openrouter', method: 'POST', path: '/api/v1/chat/completions', body, stream: true });
if (!response.stream) return wholeAnswer(response);       // answered whole, as without stream: an error, or no event stream
let text = '';
let ended = false;
for (let done = false; !done; ) {
  const read = await ctx.http.read();
  for (const { data } of read.events) {
    if (data === '[DONE]') { ended = true; continue; }       // the provider's own terminal event
    const piece = JSON.parse(data).choices?.[0]?.delta?.content;
    if (piece) { text += piece; await ctx.partial(piece); }
  }
  done = read.done;
}
if (!ended) throw new Error('the stream ended before the answer did');
return { text };                                          // the whole result, as without stream
```

### 7.3 `render`, in full

**What it is given** (5-2):

| Key | What it holds |
|---|---|
| `model` | the catalogue entry id the person chose |
| `entry` | that entry's file, where the catalogue has one |
| `prompt` | the prompt, as the app built it |
| `inputs` | **an object keyed by the catalogue's own input names** — `first_frame`, `last_frame`, `mask` and `audio`, each one descriptor, and `reference_images`, a list of them |
| `params` | whatever the feature passed: size, steps, the model's own options |
| `seed` | an integer 0 to 4,294,967,295 (5-2b): **the caller's where one was given** — to make a render again, 0 among them — else a new one the app makes for every render, and recorded with each take. Never yours to choose: one a plug-in sent every time would have a service answer every job from its cache. Where your service took no seed, answer `seedApplied: false`, and the take is recorded without one |
| `source` | the entity the render is for — `{ stem, type, tag, epoch? }` — so that you know where you stand and can read the rest of the film from there |

A **descriptor** is `{ media, path?, mime, bytes?, width?, height?, durationMs?, grant? }`: `media` is the reference as an entity's file writes it, `path` is the frozen copy's absolute path on a program route only, and the rest is what the import measured. **JavaScript never reads the media it sends** — an answer that echoes it comes back as the service sent it: you hand the reference to a service through `ctx.upload`, or place it into a request with `embed`, by the descriptor's `grant` — the permission travels with your `ctx.call` to the platform plug-in that sends it — or name it in a workflow your own server can read. On a program route, give the frozen `path` to the chosen executable. An input name the model's entry does not list, one it requires that is missing (a list that names none of them, or fewer than the entry's `min`), a value that is not text, or one whose name is no picture, clip or sound, is `badArgs`/`inputs` **with the name**, and your code never runs (5-2b); a file the film's index does not list is described all the same, with nothing measured.

**What it answers** (5-2b), by `state`: `{ state: "succeeded", outputs: [...], usage?, account?, cost?, stack?, seedApplied?, metadata? }` — `stack` your word for how you ran the model, recorded with the take; or `{ state: "failed", error: { code, message, retryable?, … }, usage?, metadata? }`, which the app gives the person as the render's failure with your code — `message` is screened for a credential before it is cut to 500 characters wherever a FilmOpen keeps it; or `{ state: "pending", job, … }`, which this FilmOpen answers as something it cannot wait for yet. An answer without `state` is `badResult`, with where. Each output is either

- `{ url, mime, durationMs?, width?, height?, metadata?, … }` — an **https** address the app downloads, with no credential and following no redirect; any other scheme, `http` or `data:` among them, is `badResult` at its `url`; or
- `{ server, path, mime, durationMs?, width?, height?, metadata?, … }` — a **name and a route on a server** one of your `server` settings points at (5-2, §10): `"comfy"`, or `"<tag>:<setting>"` for another plug-in's server, where your manifest declares a callable `platform` interface function on that plug-in and `plugInsMayCall` permits it. Custom offers do not authorize output downloads. No redirect is followed there either, and the address is the one the person typed.

An output may say its `role`; a `preview` is never kept as a take, and **a file that is not the `mime` it says is not kept at all** (5-2b). The app downloads each output into the film's media and writes them as **takes of the entity `source` names**, in a batch of `kind: "plugin"` whose items record the model, the platform, the prompt, the parameters with the seed and the inputs **as the app prepared them**, and from your answer only `stack` and `seedApplied: false`. With no `source` the outputs are listed and nothing is written.

**`metadata`** is your container: an object with an integer `v` — your own layout's version — and whatever a later render from this one needs, such as the provider's task and continuation ids, on every answer (pending, succeeded, failed, and `cancel`'s) and on each output, **complete at every answer, never a delta**. It is optional; any other shape is `badResult` at its path. The app keeps the containers of the answer that delivers the render whole (a failed answer's with a later FilmOpen), reads nothing in them but `v`, never fetches from an address in it, and replaces a value that is plainly a credential by `[refused]` where it stood, recording its path; put no credential, authorisation header or expiring link in it. What each output says of itself — `id`, `seed`, `role`, `mime`, `width`, `height`, its duration — is kept with its take as you said it, beside the seed the app sent. **Each output is fetched on its own**: one whose download fails or whose bytes are refused is recorded as not fetched and the others are kept; where none was fetched the render fails. `render`, `designVoice` and `speak` are given `stage` (`prototype`, `draft` or `final`) and may be given `from`, the take a render continues as the app recorded it — both optional in the schema, and sent by a FilmOpen that sends them; an adapter that rebuilds its arguments keeps both.

*Planned:* a render that outlives a call — answering a job and letting the app collect it later (`collect`, `cancel`) — for a render that takes more than the ten minutes a call has.

### 7.4 Offers — `offers` (5-2)

A function another plug-in may call, by `"<tag>:<name>"`. It is called as a hook is, `(ctx, args)`, and answers JSON. **It runs as its owner** — its settings, its servers, its keys, its storage — and `ctx.caller` names the plug-in that asked.

**A name the contract holds may not be offered** — every function of every interface (`render`, `complete`, `estimateCost`, `verifyKey`, `transform`, `analyze`, `import`, `export`, `run`, `request`, …) and every plug-in's `status`: a function of an interface is reached because your manifest implements that interface and the contract says who may call it, never because you offered it. Nor a name every object has (`constructor`, `prototype`, `toString`, `valueOf`, …), **nor a function one of your own actions calls**: an action is a person's button, with their gesture behind it, and a caller must not press it. **Keep the offer's name** — a platform plug-in's `run`, `status` and `request` are the names every caller expects — and give the **action** a function of its own that calls it, as the template's `hello` action calls `template:greet` through `ctx.call`. Each of these is refused where your manifest is read **and** again at the door; an offer refused there is `badEntry` on `offers.<name>` on your plug-in's page, and the offer is simply not there.

### 7.5 Actions — `actions`

A button on your plug-in's page in Settings → Plugins. It takes `ctx` alone and answers `{ message, args?, … }`: a string key of yours and the values for its placeholders, shown under the button. **An action that could not do its work says so**: its answer's `state` is `'failed'` and its `error` a `Problem`, beside its `message` — the page then says it failed, in the error colour and in your message's words, or the problem's where you give no message, and logs the problem's code, never its words; a message without that state is shown as the action's answer, whatever it says, so a button that only tells something answers one too. An answer of another shape is shown as it is. An action may carry an `example` in its manifest entry, for the developer page's box.

*Planned:* feature hooks a tool answers — `rewrite(ctx, { text, instruction, context? })` → `{ text }` behind the dictation popup's *AI rewrite*. `options(…)`, what a model can do on a route and at what price, is §7.6's.

### 7.6 Options, jobs, media by grant, usage, and five interfaces

The definition settles what a render that outlives a call, a paid service and a server on demand
need; each is **planned** until this FilmOpen builds it, and its shape is in `REFERENCE.md`:

- `render`'s **`options`** answers your ways of running a model, each with its own readiness, the choices they take
  and a quote of those chosen; `render` is handed back the `stack`, the `destination` and the `quote` the person
  chose, and answers `failed` with the code `quote_changed` rather than spend more.
- **A job**: work that outlives the call answers `pending` with your own `job`; `collect` and `cancel` are called
  with it, bound as the render was. Keep your receipt of the work under `ctx.job.id`, never under one key for every
  job.
- **Media by grant**: a descriptor carries a `grant`, which `ctx.upload` sends — or the descriptor's `media`,
  exactly one of the two — or which an `HttpRequest`'s `embed` places into the body where a
  service takes the media inline; an inline answer is kept with `ctx.stage`, and your
  output names its `handle` — never a `data:` address.
- **Usage**: what a call used, in its units, with `billing` and its basis — `provider`, `price`, `estimate` or
  `unknown`; a cost nobody knows is unknown, never zero, and a paid call that then fails answers its usage with its
  failure. The app reads `usage` first, then `cost`; a `requestId` must be one your call received.
- **Scriptwriting workflows** (no function): `implements["script-writer"]` declares `workflow`, a path under `assets/`; the app reads and checks its `Workflow` without running the plug-in. Each step calls an offer with its fields and `focus`, can answer Markdown `text`, and proposes imports for review; `llms` chooses its model, subject to *Use the LLM:*, and `minutes` gives its wall time (default 10, at most 30). Labels, help and headings use a matching plug-in string key or the words as written.
- **App-called interfaces** include `prompt` (`buildPrompt(ctx, { source, target, writer, context?, model?, entry?, llm?, overrides?, block?, blocks?, language?, treatment?, preset?, tokens? })`: the selected entity's exchange object and one of the thirteen `PromptTarget`s, `writer`, the chosen writer's declaration as the manifest declares it (a writer plug-in declares `writers`, each `{id, label, target, kind, asset, models?, llms?, estimate?}`, `kind` being `template` or `llm`, `label` a key of its strings, `llms` an LLM writer's preferred text models in order, `estimate` the `{input_tokens, output_tokens}` one call of an LLM writer is expected to use), `context` for every target as resolved exchange entities, `model` and its catalogue `entry` only where a media model is chosen, `llm: {id, entry}` for the LLM frozen for the call where one is reachable, a frame's `block` as the scene holds it for `first-frame` and `last-frame`, and for `clip` its `block`, the later `blocks` it covers, the block's `language` (also for first-frame and last-frame), the effective `treatment` for first-frame, last-frame, clip and treatment, the effective `visual_style.preset` as `preset` for `treatment`, and `tokens`, the media the source's prompt may name for this target as `{ token, name }` — `@inspiration-1` and `@reference-1` on an entity's own prompts, `@<stem>:reference-1`, `@<stem>:character_sheet-1`, `@<stem>:location_sheet-1`, `@<stem>:outfit_sheet-1` and `@<stem>:prop_sheet-1` in a frame's and a clip's (one picture per context character, outfit, location and prop: its first sheet, else its first reference), each with the words the person's chips show — of which a writer may write any into its prompt, and only these (the application turns each into a picture the model receives; absent for `voice` and `treatment` and where the source has none), answering a prompt or `{prompt: null, reason: "no-prompt"}`) and `model-picker` (`getDefaultModels`: kinds and stages, answering defaults and suggestions) and `prompt-builder` (no function: `implements["prompt-builder"]` declares `catalog`, a path under `assets/`, and `target`, `visual_style`; the app reads the catalog, its strings and pictures without running the plug-in), alongside four interfaces: `reference-analysis` (`describeReference`: a picture or a recording of
  a character, answered in the document's own leaves, a null or an empty list changing nothing, and naming its
  `kind` again), `style-analysis` (`describeStyle`: a visual
  treatment's leaves), `voice` (`designVoice`, `saveVoice`, `speak`) and `server-provider` (`serverCapabilities`,
  `serverOffers`, `deployServer`, `listServers`, `resolveServer`, `wakeServer`, `stopServer`); a server provider's
  `deployServer` and `wakeServer`, and a `deploy` and `wake` a server provider offers, are for a
  server's own screen alone — *Start server* on the GPU page's *Servers* tab — never an action, the developer page or
  another plug-in. **A function of the
  definition is never an offer**: an offer of one of these names is refused, so a plug-in declares the interface in
  `implements` instead. `describeReference` and `describeStyle` are handed one piece of the film's media, granted to
  that call alone, and answer in the document's own leaves; the app still reads the camelCase names plug-ins
  answered before these interfaces (`facialHair`, `heightCm`, `weightKg`, `creatorNotes`, `defaultOutfit` — a
  picture's clothing as the prose `outfit_description` — `colorTempBias`, `lensCharacter`, `depthOfField`,
  `cameraCharacter`), but an answer that names one leaf twice is refused, as is a change that sets an object
  rather than one leaf.

An assistant declares its required `implements.assistant.catalog` path under `assets/` and exposes no assistant functions. The host owns the catalog action's conversation, microphone, playback, sockets, transcript and cleanup. The host voice finalizer holds its proposal to one target field, of any length, with explicit review and Apply. The limits are the model's: the host asks for the model's catalogue output maximum through a verified provider mapping, none where the catalogue names none, and counts no turns, measures no context, history or answer and keeps no clock of its own; nothing is truncated. `VisualStyle` holds camera, camera_mount, lens, depth_of_field_prompt and color_grading as Observed text.

The exchange doors are ordinary `ctx` API members for every running call. FilmOpen keeps the assistant operation's exports, including its base, until the operation ends — cancelled, failed, with nothing to change, or its proposal applied or discarded. An import proposes and never writes; only the person's Apply writes.

## 8 The limits

Each call runs alone, in a fresh engine that is thrown away afterwards:

| | |
|---|---|
| JavaScript time | **30 seconds** — waiting for a request, a call or `ctx.sleep` does not count |
| the whole call | **10 minutes**, waiting included, except `complete`, which has no wall-clock cap |
| memory | **64 MB**, with a 1 MB stack |
| what a call may answer | **16 MB** |
| a request or an answer through a door | 16 MB |
| `ctx.storage` | 256 KB per plug-in |
| your code | 32 files, 2 MB in all |
| at a time | one call per plug-in and five in the app; a call a plug-in makes takes neither, and at most four calls stand on one chain |
| `ctx.log` | a line and its data are kept whole, on the developer page and in its log |
| a request | 60 seconds by default, 300 at most |

Past a limit, or when your code throws, the call ends with the reason shown to the person — and FilmOpen carries on. A cancel reaches your code as `ctx.signal.aborted`, and as a throw from `ctx.sleep`.

## 9 Keys

**Your code names a key; FilmOpen adds it.** You name the key, and FilmOpen adds it to the request where the platform needs it; an answer comes back as the platform sent it, so a platform that echoes the key hands it back:

```js
const answer = await ctx.http({
  key: 'fo-openai:openai',
  method: 'POST',
  path: '/responses',
  body: { model: 'gpt-5.6-terra', input: prompt },
});
if (answer.status !== 200) throw new Error(ctx.l10n.t('failed'));
return answer.json.output.find((item) => item.type === 'message').content[0].text;
```

- A key's id is `<owner>:<slot>`. The owner is the plug-in that declares it in `keys`; FilmOpen owns no key of its own, and the tag `app` is reserved. The speech services' keys are the provider plug-ins' (`fo-openai:openai`, `fo-xai:xai`).
- The request goes to the key's platform, described by a platform file: `path` is added to its `base_url`, the credential goes in the header the file names, only over https, only to the file's `hosts` — **and, on a host the file names `paths` for, only to those paths**, matched by whole segments (`/api/v1/key` is not `/api/v1/keys`) — following no redirect elsewhere. A path outside them is refused `path`; one that cannot be made plain — a `.` or `..` segment however it is escaped, an escaped slash, backslash or `%`, any backslash, an empty segment or a trailing `/`, a control character — is refused `bad-path` before anything is matched. Either way nothing is sent. A key reaches what its platform's models need and never an endpoint that makes keys or reads an account: the app's own OpenAI key, granted to you, reaches what FilmOpen itself uses there — `/v1/models`, `/v1/responses`, `/v1/images`, `/v1/realtime` — and nothing else. Anything else is refused.
- **Use a key another plug-in already has** by naming it in `uses` rather than declaring your own: the person types their key once, and grants it to your plug-in with one tick. Declare a key of your own only for a use nobody else covers — a second account, a client's budget.
- **A platform FilmOpen does not know** — a new vendor — is one file, `platforms/<id>.json` in your plug-in's folder, in the shape of `assets/models/platforms/` in the FilmOpen repository (how a key is typed, checked and sent). A file for a platform the catalogue already has is ignored. **It serves your own keys**: another plug-in's key on that platform is sent by its own file, never by yours, nor yours by theirs; and it names the platform for the app only while your plug-in is on.
- **The transport's own headers** — `Host`, `Content-Length`, `Transfer-Encoding`, `Connection` — are not yours to set: they are dropped from every request.

## 10 Servers: a machine the person runs (5-2)

A renderer on their own computer or on their network has no key and no vendor: it has an **address the person typed**. Declare it as a setting of type `server`, and reach it with `server` and a `path`:

```json
"settings": { "comfy": { "type": "server", "default": "http://localhost:8188", "label": "comfy" } }
```

```js
const answer = await ctx.http({ server: 'comfy', method: 'POST', path: '/prompt', body: workflow });
```

- **No credential ever travels to a `server` address** — not a key of yours, not one you were granted: the app refuses the request rather than sending one.
- Plain `http` is allowed, because a machine on a person's own network has no certificate; **the address is the address**, and no redirect off it is followed.
- A `server` setting is always kept **on this computer**, whatever `scope` says, and may not be an `entitySettings` field: an address on one person's network means nothing in another's copy of the film.
- Its `default` may only name **this computer** — `localhost` and any name under it, anything in `127.0.0.0/8`, `::1` and its longer spellings: any other address would be one the person never typed.
- **Another plug-in's server** is named `"<tag>:<setting>"`. Fetching render outputs from it requires a declared call on that owner belonging to the `platform` interface and allowed by `plugInsMayCall`: `run` and `request` qualify, custom offers do not. Planned `collect` and `cancel` qualify only once the contract makes them callable. A stock model renderer using `cui:run` retains its fetch authority without custom offers.

## 11 Calls: a plug-in that calls a plug-in (5-2)

```js
const answer = await ctx.call('fo-cui:run', { model: 'z-image', input: workflow });
```

- Your manifest declares the call in `calls`, the other declares the function in `offers`, and **both must be enabled**. The person sees every call you declare on your consent screen, said in the other plug-in's own words.
- The function **runs as its owner**: its settings, its servers, its keys and its storage, never yours. JSON crosses in each direction and nothing else.
- A call takes neither the one-call-per-plug-in slot nor one of the app's five, or a plug-in asking the text model it itself provides would wait for itself. Its **frame** bounds it instead: at most four calls on a chain, one child at a time, and every child cancelled when the caller ends.
- **A function already on the chain is refused** (`cycle`), so nothing calls itself for ever. `ctx.ai.complete` follows the same frames, which is what stops a text provider whose `complete` falls back on `ctx.ai.complete`.
- A plug-in that is not installed, not enabled, or has not offered that name, is refused `notInstalled`, `notEnabled`, `cannotRun` (on, and unable to run) or `notOffered` (5-2b), with the app's own sentence as the refusal's `message`, which you can show.

## 12 Strings

`l10n/<locale>.arb`, the same format as FilmOpen's own: `{"@@locale": "es", "hello": "Hola", "@hello": {"description": "The button"}}`. `en` is required. Placeholders are `{name}`.

- An unprefixed key is **yours**: `hello`. A key may not contain `:`.
- `app:<key>` borrows one of FilmOpen's own strings on purpose: `app:save`.
- A missing string shows its key, so you see what to add.

## 13 Trust

**FilmOpen's own plug-ins are on when installed — because the app installed them from its own bundle, not because of anything in the manifest.** The `author` field grants nothing: anybody may write `"author": "filmopen"`, the template does, and a copy of the template in your library or your development folder asks like any other plug-in. Any other plug-in — dropped into the library, installed from a zip, or found in the development folder — is **off until the person allows it**, on a screen that lists the keys it declares and asks to use, the hosts it reaches, the servers it names, the plug-ins it calls, the entity types it reads and writes, and its settings.

**What the person consents to is every file of your folder** (5-2): the manifest, the code — all of it, in the order `entry` names — and what the code reads, your `assets/` among them. Change any of them and the plug-in is off again and asks again, which is what makes a workflow in `assets/` as safe as the code beside it.

## 14 The developer page, and how to debug (5-2)

*Plug-in developer page…* on Settings → General's **About** card, and *Open in the developer page* on a plug-in's own page. **It is in every desktop build, release builds included, with no switch before it.**

It **runs a plug-in's code as it is on this computer, without the question FilmOpen asks before it runs a plug-in you installed, and with every key its manifest asks for** — so run only code you wrote or trust. **The waiver is for that plug-in alone**: a plug-in your code calls is still the installed one, and must be enabled and allowed as usual, or the call is refused `notEnabled`. Two plug-ins of your own in the development folder means allowing the one you call, once. Everything else is the app's own: the same sandbox, the same doors and their refusals, the same limits, the same usage records, the same one call at a time. What passes here passes in the app.

- **The plug-in**, from those installed — the development folder's or the shared library's — each by name, tag and where it was found, with every problem the reader found listed by file.
- **The function**: `status` first — what *Check* runs on your plug-in's page — then the functions of the interfaces it implements, its actions, and what it offers other plug-ins (5-2b); or *Other…* and any name.
- **The arguments**, one JSON box filled with that function's example — the definition's for a function of an interface, your manifest's for an action or an offer. Everything that crosses into a plug-in is JSON, so one box serves every function.
- **How it is called** (5-2b). ***As FilmOpen calls it***, the default, sends what the app would send: `status` and an action with `ctx` alone, as *Check* and the button do; a `render` with the catalogue's entry, the inputs described and held to the entry, a seed and the entity to save to; a completion or an estimate as the app builds them; an entity hook with the entities chosen. A request the app would never make — a model the catalogue lacks, or one your plug-in does not serve — is refused before your code runs, and a render's outputs are saved as takes exactly as the app saves them. A `buildPrompt` is prepared as *Generate* prepares it, for the entity selected in the app's tree — a folder or the project for a treatment: name `target`, `writer` (one of your writers' ids for that target; none, your first — an object is refused `badArgs/writer`), `blockId`, `covered` (block ids), `model` and, if you want other media than the card's, `tokens` (`{token, name}`) in the box, and your code is handed your writer's declaration, the model's catalogue entry, the media the Prompt card offers and the LLM decided from your writer's `llms`. ***Exactly what I typed*** sends the box as it is, for your function's edges, and saves nothing. ***Console*** runs the box as JavaScript with `ctx`, against the open project, after your plug-in's own files — so your top-level names are there: `return await ctx.project.export('scene_with_context', ['1'])` answers what a writer would read. Its result, its lines and `last-run.json` are a call's, the function named `$console` and `args` the script. Called as FilmOpen calls it or as typed, an answer of a function of an interface is held to the definition — the console's is held to nothing —, as an offer's own `args` and `returns` hold a call to it, and one of the wrong shape says where.
- ***Call*** reads your files **from disk again**, so you edit, call and read with no restart and no *Allow* for every save. ***Stop*** ends it as the person's own cancel does.
- **The result**: the outcome as one line — a failure's code, its reason, for an answer of the wrong shape **the path in it**, your own message, and **its file, line and column** — the time it took, and the value as formatted JSON.
- **The log**, growing while the call runs, its first row **the request as sent** (after a writer's `context` line): every `ctx.log` line with its data, and a row for every door your code used, in order — `http` (the setting or the key it named, the route, the status, the milliseconds), `call`, `storage`, `progress`, `project.*`, `ai.complete` — what the model was asked, as it is asked, then its answer or its refusal with the message —, `sleep`. **A plug-in your code calls is in it too**: what it logged and every door it used, each row carrying that plug-in's tag — with **its own** settings and keys, since it runs as its owner — so a call you made is not a row but everything that happened inside it. The log holds what crossed into JavaScript and nothing else, so **no credential is in it**, and a request's query never is.
- **Two files**, at the paths the page shows: `last-run.json`, the whole of the last call as data for an agent — which way it was called (`mode`) and the request as sent (`args`) among it — under a megabyte; and `plugins-dev.jsonl` beside the app's log, a line per line of every call made from this page, to `tail` while you work. **Only calls made from this page are written there.**

`ctx.log('about to call the server')` is yours to read here. **Every line, whoever started the call, goes to the app's own log too**, at the supplied level (default `info`): one shaped like an event name (`fetch.done`) as `plugin.<tag>.<event>`, any other as `plugin.<tag>.line` with its words as `text`; a `debug` line is discarded when verbose logging is off, unless the environment pins a debug threshold. A line whose level is not one of the four is **counted and written nowhere**, and your plug-in's page says how many there were.

**Through the MCP control**, as an agent does: every control has an identifier — `plugin-dev.plugin`, `plugin-dev.function`, `plugin-dev.mode`, `plugin-dev.args`, `plugin-dev.call`, `plugin-dev.result`, `plugin-dev.log`, and `plugin:<tag>.<setting>`, `plugin:<tag>.action.<id>`, `field:<stem>:plugins.<tag>.<key>` elsewhere — so `find`, `set_field`, `tap` and `log_tail` drive and check your plug-in with no new op. The FilmOpen repository's `packages/filmopen_mcp/README.md` says how.

## 15 Share

A plug-in travels as a zip of its folder, `<tag>-<author>-v<n>.zip`. *Install from file…* on Settings → Plugins unpacks it into the library and shows the consent screen. Please publish your plug-in's source: FilmOpen is shared source, and a plug-in whose code people can read is one they can trust.

## 16 Asking an AI agent to write one

Give it this folder and a sentence such as: *"Copy `template` from the plug-ins repository to `scene-polish` in my development folder, and make its transform ask the text model, through `fo-openai:openai`, to tighten each dialogue line; keep the setting and the strings in English and Spanish."* Everything the agent needs is in this README, in `REFERENCE.md` and `filmopen-plugin.d.ts`, and in the template — and the developer page (§14) is where it checks its own work: `last-run.json` is the answer as data, and `plugins-dev.jsonl` the log to tail.
