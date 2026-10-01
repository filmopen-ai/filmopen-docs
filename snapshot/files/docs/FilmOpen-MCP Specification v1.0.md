# FilmOpen MCP Specification

**How an agent controls FilmOpen over MCP.**

| | |
|---|---|
| **Version** | 1.8 |
| **Date** | 21 September 2026 |
| **Status** | Describes the agent layer at the end of **milestone 5-2b (one contract between the app and a plug-in)**: the developer page's two ways of calling — `plugin-dev.mode` with its chips `plugin-dev.mode.app` and `plugin-dev.mode.typed`, and `set_field plugin-dev mode app|typed` — `plugin-dev.folder-problems`, `plugin-dev.source` only as FilmOpen calls it, the request as sent the first row of the page's log and the `args` of `last-run.json`, and a call **asked for its result and never waited on for idle**, since `wait_idle` knows nothing of a call (§7.14, §8.2); test plans 060 and 090 brought to them. **Before it, 1.7**: Describes the agent layer at the end of **milestone 5-2 (what the app owes a plug-in's author)**: the plug-in developer page and the development folder as an agent reaches them — `settings.plugin-dev`, `settings.plugin-dev-folder` with its `-choose` and `-clear`, `plugin:<tag>.dev` on a plug-in's own page, and the page's own `plugin-dev.*`; `set_field plugin-dev plugin|function|args`, which types as a person does; **`plugin-dev.args` outside `valueIdentifiers`**, so what is typed there never travels back; the recipe of §7.14; and the walk's developer-page step and test plan `090_plugin-dev-page.md`. **Before it, 1.6**: Describes the agent layer at the end of **milestone 5.11 (folders in the script)**: the selection's kind `script` and the type `fo`, the types `se`, `ep` and `sq` gone from it — a removal from a channel whose values otherwise only grow, accepted by the owner, no client outside this repository existing; the identifiers of the script's doors — a row's menu in the tree (`tree.add-folder`, `tree.add-scene`, `tree.move-up`, `tree.move-down`, `tree.move-to`, `tree.remove`), the Contents card (`contents.*`, `contents:<entry>`), the move dialog (`move.*`), a scene's cast rows (`cast:<stem>:…`); the fields of a folder's and a scene's form, and a project's `kind`, which takes text; *New project* without a kind, opening on the project's first scene; what `typed` means for a field that holds one word out of a list; the recipe of §7.13; the walk's folder step and test plan 070. **Before it, 1.5**: Describes the agent layer at the end of **milestone 5.01 (Android)** and **milestone 5.1 (plug-ins)**, both merged into `main` on 18 September 2026 as this one 1.5 (each close took 1.4, after the 1.3 both knew). **5.01**: `launch(platform: android, device:)` and the runners' `--platform android --device`, the app found through `flutter run`'s output alone, `stop` ending the app on a device through its own exit, a check a phone's screen cannot reach skipped with its reason, and `keys.<owner>.<slot>.key.show`, the eye on a key box. **5.1**: `set_tab plugins`, the identifiers of Settings → Plugins, a plug-in's page and consent (`plugins.*`, `plugin:<tag>.*`), a machine setting typed with `set_field plugin:<tag>`, a plug-in's card on a page (`field:<stem>:plugins.<tag>.<key>`), *Plugins…* on the file menu (`page.plugins.*`), Provider keys by owner (`keys.<owner>.<slot>.*`, renamed from `keys.<platform>.*`), and the acceptance walk's plug-in step. Before them, **milestone 4.9**, closed on 16 September 2026 on the branch `milestone-4-9-platform` and merged into `main` the same day, beside **milestone 5 (media)**, merged the same day: Settings → Provider keys and Settings → Usage as tabs an agent opens, a provider key typed only as a visibly fake value and checked by a stub, dictation driven through its popup's identifiers on a fake microphone answered by a script, and `quit` putting back dictation's two preferences; the media identifiers of §6 (`media.add`, `media.browse|url|import|cancel`, `media:<stem>:<n>`, `player.close|reveal|play|pause|seek`, and a media source’s own panel in *New project*), and `scripts/agent_walk.py` driving the player. 4.9's branch left `main` at 1.0; the issue recorder's close (1.1) and milestone 5 (1.2) took `main`'s copy on meanwhile, so the merged document is 1.3. Before them, the issue recorder’s phase 1 (the record tools, `page_shot` as the whole view, §7.12), merged into `main` on 15 September 2026 from `filmopen-recorder-49b`, and before it MCP step 3 (the headless Linux runner). Step 2's walk was verified on Windows; step 3's control on a headless Ubuntu 20.04 VPS under Xvfb (critic 9/10); the whole walk again on Windows, at 700 and 532 px, by the architect's check (`scripts/agent_walk.py`, `docs/archive/FilmOpen-MCP Results.md` §10.7) |
| **Audience** | Any AI agent, coding session or script that has to start, drive, read or stop FilmOpen without a desktop: a Claude Code session, a critic, a support agent, a test harness |
| **Companion documents** | the Software Specification (`docs/software/`) §4.3 and §7.1 (how the layer is built into the app), `docs/archive/FilmOpen-MCP-Plan.md` (step 2, done), `docs/archive/FilmOpen-MCP-Plan-Step3.md` (the Linux runner), `docs/archive/FilmOpen-MCP Results.md` (the record), `docs/archive/FilmOpen-Issue Recorder.md` and its `Results` (the recorder the record tools drive), `packages/filmopen_mcp/README.md` (the server's own page), `docs/FilmOpen-Project-Specification v1.0.md` (the file format the app reads and writes) |

---

## Contents

1. What the layer is
2. Setting up
3. The tools
4. The shapes: state, selection, semantics, log events
5. Error codes
6. The identifiers an agent acts on
7. Recipes
8. Rules, limits and security
9. The data channel and the command line (for a client that is not an MCP client)
10. Glossary

---

## 1. What the layer is

FilmOpen is a Flutter desktop application that browses and edits a film project stored as plain JSON files, versioned per author (`docs/FilmOpen-Project-Specification v1.0.md`). The agent layer lets a program drive a running FilmOpen through **named operations** instead of a mouse and a screen:

```
an MCP client (Claude Code, a script)            any machine that can reach the box
   │  MCP over stdio: tools/list, tools/call
   ▼
filmopen_mcp                                     a Dart command-line program, spawned by the client
   │  Flutter's driver extension over the app's VM service (localhost): a JSON data channel
   ▼
FilmOpen, the agent build                        flutter run -d windows|linux -t test_driver/agent_main.dart (under Xvfb on Linux)
   └─ the host answers each operation through the doors a person uses
```

Three facts shape everything below:

- **An agent build is a separate way of starting the app**, `flutter run -t test_driver/agent_main.dart`. An ordinary debug run and every release build carry no driver, no channel and no listener; a tool pointed at one answers `not_agent_build`.
- **Every write an agent asks for goes through the same widgets and the same writer as a click.** Typing goes through the form's own field setter, or, in a dialog's box, through the keyboard's own path (`enter_text`); a fork, a pick, an official pointer, a copy are taps on identified controls. What the app refuses to a person, it refuses to an agent, with a code instead of a sentence.
- **Answers carry codes, stems and identifiers — never a person's text.** The text an agent typed is not repeated; a label it tapped is not repeated; the log travels without error messages; e-mail addresses are masked; typed values travel only under the project's own identifiers. Pictures show what the screen shows.

---

## 2. Setting up

### 2.1 What has to be on the machine

- The repository on `main` (or a branch that contains MCP step 3), with `flutter pub get` run once at its root — it resolves the whole workspace, the server included.
- The Flutter SDK the repository names (3.47.4) on `PATH`; `dart` with it.
- Windows, or a Linux box with no display: `scripts/agent-vps.sh` installs the GTK toolchain, Xvfb and the SDK, clones the repository and runs every suite (§9.3; `docs/archive/FilmOpen-MCP-Plan-Step3.md`). Linux is a runner for agents, not a product platform.

### 2.2 Registering the server with Claude Code

```
claude mcp add filmopen -- dart run E:\filmopen\packages\filmopen_mcp\bin\filmopen_mcp.dart serve                # Windows
claude mcp add --scope user filmopen -- dart run ~/src/filmopen/packages/filmopen_mcp/bin/filmopen_mcp.dart serve   # a Linux box
```

- The path is the repository the server drives: `launch` runs `flutter run` there.
- The registration belongs to the folder it is run in (Claude Code's default scope); `--scope user` makes it available in every folder.
- The tools appear in the next session started there, not in the session that registered them. When a session starts the server, `dart run` compiles it for a few seconds first.
- The server's name is `filmopen_mcp` (version 0.2.0); it offers 24 tools (§3) and speaks MCP over stdio.

Any other MCP client spawns the same command. There is nothing to configure: the server finds or starts the app by itself.

### 2.3 Finding the app

Every tool that talks to the app takes an optional `vmServiceUrl`. When it is left out, the server looks in this order and uses the first that answers:

1. the app it `launch`ed itself, while its `flutter run` runs;
2. the URL the server was started with (`--vm-service-url`, or the environment variable `VM_SERVICE_URL`);
3. the app the open link already reaches;
4. the agent build announced in `agent.json` in the app's log folder, while its service answers.

`agent.json` is written by every agent build a second after it starts, in `%LOCALAPPDATA%\FilmOpen\logs\` on Windows (`$XDG_STATE_HOME/filmopen/logs/`, else `~/.local/state/filmopen/logs/`, on Linux; `~/Library/Logs/FilmOpen/` on macOS):

```json
{"vmServiceUrl": "http://127.0.0.1:55065/<token>=/", "pid": 13636, "startedAt": "2026-09-14T10:27:22.917Z"}
```

The URL carries a token that opens the app's VM service; it is valid on the loopback only and dies with the process. `quit` removes the file. A URL from anywhere else must be `http` on `127.0.0.1`, `localhost` or `::1`; anything else is `bad_args`.

On Linux an app that `launch` started has XDG folders of its own (§3.1, `home`), so its `agent.json` is at `<home>/state/filmopen/logs/agent.json`: the server that launched it knows the URL anyway, and another process — the one-shot commands in a shell, say — finds it with `XDG_STATE_HOME=<home>/state` in its environment, or with the URL itself.

So an agent has two ways to get an app: call `launch`, or have someone run `flutter run -d windows -t test_driver/agent_main.dart` in the repository (`scripts/agent-run.sh` on Linux) and let discovery find it.

**Android is the exception to discovery.** `agent.json` is written in the app's own log folder, which on a device is inside its sandbox, so no server on this machine can read it; a launched android app is therefore known only from `flutter run`'s output, and a command in another shell is given `--vm-service-url` (the line `flutter run` prints, which is on the loopback because it forwards the port). `stop` from such a shell still works, the app ending its own process there (§3.1).

---

## 3. The tools

All 24 tools answer either **JSON text** (one `text` content item holding a JSON value), **an image** (`image/png`), or **an error result** (`isError: true`, one text item `{"code": …, "detail": …, …}`, §5). Every tool but `launch` takes the optional `vmServiceUrl` (§2.3). Calls run **one at a time** in the order they arrive; a `launch` that builds the app holds the calls behind it.

### 3.1 Starting and stopping

| Tool | Arguments | Answer | Notes |
|---|---|---|---|
| `launch` | `platform` (`windows`; `linux` under `xvfb-run`; `android` on a device; the machine's own by default), `device` (**android only, and required there**: the serial `adb devices` names, the emulator's being `emulator-5554`), `project` (a folder path, or `sample`; the sample by default), `theme` (`system`/`light`/`dark`), `locale` (`en`/`es`), `size` (`<width>x<height>`, each side 320–4096; `1280x720` by default; **refused on android**), `home` (Linux: a folder whose `share`/`state`/`cache` become the app's XDG directories; omitted, a fresh temp folder is made and removed on `stop`; **refused on android**) | the state (§4.1) once the app runs and has applied the options | Runs `flutter run -d <platform> -t test_driver/agent_main.dart` in the repository. On Linux: `setsid xvfb-run -a` with the Xvfb screen of `size`, and `FILMOPEN_WINDOW` for the GTK window; the Windows runner reads the same variable and adds its frame around it, so on both `size` is the **view's** size, what `state.view` answers (to the pixel where the frame divides by the display's scale). `home` is Linux's; on Windows every build shares the machine's store (§8.1). **On android** the device's serial stands where the platform's name would, so `flutter run -d <serial>`: a machine may have a phone and an emulator attached at once and which one is the caller's to say. There is no screen to make and no window to size — `size` and `home` are **refused** rather than ignored, so a call that asked for a width is told it was not honoured, and `state.view` reports what the device actually has (426 × 952 dp on the `Pixel_10_Pro` emulator, 411 × 891 on a Galaxy S24 Ultra). The app writes no `agent.json` a server on this machine could read, so a launched android app is found through `flutter run`'s own output alone and the one-shot commands need `--vm-service-url`; the URL is on the loopback either way, `flutter run` forwarding the port. A first build takes minutes; a warm one about 15 s. `already_launched` while an app it started runs; `launch_failed` (`exited` or `timeout`) with `flutter run`'s exit code and its last 40 lines when the app never answered; `bad_args` / `size`, `home`, `device` or `platform` for a bad or missing value; a refusal after the app started carries `"launched": true`, and `stop` ends it |
| `stop` | — | `{"stopped": true, "by": "quit" \| "q" \| "kill"}` | Ends the app: its own `quit` first (drafts written, the session's settings put back, `agent.json` removed), then, for an app the server launched, `q` to `flutter run`, and its whole process tree after 30 s more. Usually seconds; at worst about two minutes. A draft the app cannot write refuses it — `refused` / `drafts` — and the app stays (§7.9). An app the server did not launch is ended only through its own `quit`; no process the server did not start is ever ended. **On android the app ends its own process** after `quit` has written the drafts and put the settings back: Flutter's `exitApplication` is the desktop embedders' door and does nothing there, so the activity would merely go to the background and `flutter run` would wait on an app that never ended (milestone 5.01, step 4). Only the agent entrypoint does this; no product build reaches that line. `timeout` / `quit` when the app was asked and did not end |
| `quit` | — | `{"quitting": true}` | The app's own exit, without waiting; `stop` does this and waits. After it, any further call may be cut off by the exit |
| `ping` | — | `{"ok": true, "spike": "p0", "channel": "filmopen_automation"}` | The handshake; answered even while an op is running |
| `wait_idle` | — | `{"idle": true}` | Waits until the app runs no animation |
| `record_start` | — | `{"recording": true, "folder": … (masked), "events": n}` | Starts the issue recorder (§7.12): a tape of every tap, text, draft, navigation, tab, route, setting and log event, a picture after each action and the project's files, in a report folder beside the app's logs. `refused` / `recording` when one runs, `busy` while one is starting or stopping, `failed` / `recorder` when it cannot start |
| `record_stop` | — | `{"recording": false, "folder": … (masked), "events": n}` | Stops the recording and completes its folder (the project's files after, the log's tail). `refused` / `idle` when none runs, `refused` / `busy` while one is starting or stopping, `failed` / `recorder` when the folder cannot be completed |
| `record_state` | — | `{"recording": bool, "folder": … (masked), "events": n}` | Whether a recording runs |

### 3.2 Reading the app

| Tool | Arguments | Answer |
|---|---|---|
| `state` | — | the state object (§4.1): the project, the page, the selection, the tab, the viewer, the language, the theme, development mode, the forms open for editing, the last log event, the view |
| `find` | `query` (a substring of an identifier or a label, case-insensitive) | `{"nodes": [ … ]}`: the matching semantics nodes (§4.3) without their children, in tree order. A node scrolled out of view has the flag `hidden` and no `actions`; `tap` scrolls it into view first |
| `semantics` | — | the page's whole semantics tree as data (§4.3) |
| `page_shot` | — | an image: the whole view as the app paints it from its own render tree, at the view's pixel ratio — every route, dialog and menu included (the owner's answer to the issue recorder plan's §9.7; a native dialog such as the folder picker is not in it, since Flutter never paints it) |
| `screenshot` | `path` (optional) | an image: the whole view as Flutter rendered it, every route and dialog included — not the native window frame nor a native dialog (the folder picker). Takes about two seconds. `path` also writes the PNG, only as a new `.png` inside the server's working directory or over one the server wrote; anything else is `bad_args` / `path` |
| `log_tail` | `lines` (default 50, at least 1) | `{"events": [ … ]}`: the last events of the app's own log (§4.4) |

### 3.3 Acting on the app

| Tool | Arguments | Answer | What happens |
|---|---|---|---|
| `navigate` | `selection` (§4.2) | the state after | Shows the selection as a tree click does; the page goes to the project page if Settings was open. `not_found` for an entity, epoch, stem or batch the project does not hold (`detail` names it); `bad_args` / `stem` for a stem of another entity |
| `open_project` | `path` (a folder) **or** `sample: true` | the state after | The project menu's two doors. A folder that cannot be opened leaves `"error": "project.openFailed"` in the state |
| `set_viewer` | `handle` (`""` for nobody) | the state after | Settings' handle box. An invalid handle browses as nobody (`viewer` null, `viewerHandle` the text, masked if it holds an e-mail address) |
| `set_locale` | `code` (`en`, `es`, or `null` for the platform's) | the state after | Settings' language. `bad_args` / `code` for a language the app lacks |
| `set_theme` | `theme` (`system`, `light`, `dark`) | the state after | Settings' theme |
| `set_tab` | `tab` (`data`, `script`, `compare`, `takes`, `commentary`; on Settings `general`, `keys`, `usage`, `plugins`) | `{"tab": "<the tab open now>"}` | Taps the tab through the tab bar's own gate. `refused` with the reason's code when the tab is blocked (§5); `intercepted` when Compare's fork question is on screen instead — answer it with `tap` on `compare.fork-yes`, `compare.fork-no` or `compare.fork-reread`; `not_found` / `tab:<id>` for a tab the page lacks (`script` is a scene's only) |
| `set_field` | `stem`, `key`, `text` | `{"typed": true}` | Types into the field `key` of the form editing the file `stem`, through the field's own setter: the box takes the text and the draft the change, the autosave writes it about 700 ms later, and `entity.saved` appears in `log_tail`. `not_found` / `field:<stem>:<key>` when no form edits that stem (the page is *View*, not *Edit*), when no field has that key, or when the control takes no text (a pull-down, the genre picker, the epochs editor) |
| `enter_text` | `text` | `{"typed": true}` | Types into **the box that has the focus**, as the keyboard would, replacing what it holds — for the boxes that are not a form's field: the New project dialog's, the label dialog's, the JSON editor's, Settings' handle (`set_viewer` is the simpler door), a provider key's box (only a visibly fake value, since the text passes through the client's transcript). `tap` the box's identifier first (§7.7). With no box focused the text goes nowhere and the answer cannot tell: read the box back with `semantics` (a value shows under the project's identifiers), `state` or `screenshot`. `bad_args` / `text` without a text. It is the driver's own text entry, not an op of the app (§9.2) |
| `tap` | `id` (an identifier, §6) **or** `label` (a semantics label, for a control without an identifier — a dialog button) | `{"tapped": {"by": "id", "id": …}}` or `{"tapped": {"by": "label"}}` | Performs the tap the way a screen reader does, on the node a click would reach; scrolls it into view first. On a control that opens and closes rather than taps — a pull-down, whose field offers `expand` and `collapse` and no `tap` — it sends `expand` (or `collapse`), so `tap` on a pull-down's identifier opens its menu and `tap {"label": …}` chooses an item (milestone 4.7; before it, every pull-down answered `refused` / `disabled`). `not_found` (the identifier, or `label`) when nothing matches; `refused` / `disabled` when the control is disabled — a click would do nothing either |
| `tap_at` | `x`, `y` (logical pixels) | `{"tapped": {"by": "position", …}}` | A diagnostic only: a pointer down and up at a position. Never a step of a recorded or repeatable sequence; the layout of the moment decides what it hits |

There is no `fork`, `pick`, `official`, `copy`, `save` or `label` tool: each is a tap on an identifier (§6, §7), so it goes through the same control as a click and is refused as a click would be.

`page_shot` and `screenshot` now show the same routes and dialogs, but they are not the same picture: `page_shot` is the op `screenshot` (§9.2), painted from the app's own render tree at once, on the app's side of the link; `screenshot` is the driver's own capture, over the VM service, which can also write a `path` and waits about two seconds for the last frame to settle.

---

## 4. The shapes

### 4.1 The state

What `state`, and every tool that changes something, answers:

```json
{
  "available": true,
  "project": {
    "name": "The Cartographer",
    "source": "the-cartographer",
    "path": "C:\\Users\\…\\the-cartographer",
    "sessionCopy": false,
    "canWrite": true,
    "warnings": 3,
    "projectFile": "pj_cartographer_john123_v1"
  },
  "loading": false,
  "page": "project",
  "selection": {"kind": "entity", "type": "ch", "tag": "main-hero", "epoch": "30yo", "stem": "ch_main-hero_30yo_john123_v2"},
  "nodeId": "lib/ch/main-hero/@30yo/john123_v2",
  "tab": "data",
  "viewer": "john123",
  "viewerHandle": "john123",
  "locale": null,
  "theme": "system",
  "warnInsteadOfRefuse": false,
  "developmentMode": false,
  "editing": ["ch_main-hero_30yo_john123_v2"],
  "lastEvent": "project.opened",
  "view": {"width": 1280.0, "height": 720.0, "devicePixelRatio": 1.0}
}
```

| Field | Meaning |
|---|---|
| `project` | `null` while nothing is open. `source` is the source's label (`Sample`, or the folder's name); `path` the folder on disk, `null` for the bundled sample and a session copy; `sessionCopy` true for a project held in memory (the web, or the sample in development mode); `canWrite` whether the project can be written at all; `warnings` the count of the loader's warnings; `projectFile` the stem of the project file in use |
| `loading`, `error` | `loading` while a project loads; `error: "project.openFailed"` after a failed open |
| `page` | `project` (the browser page) or `settings` |
| `selection`, `nodeId` | what the detail pane shows (§4.2), and the highlighted tree row's id |
| `tab` | the open tab — an entity page's `data` (*View* or *Edit*), `script`, `compare`, `takes` or `commentary`, or Settings' `general`, `keys`, `usage` or `plugins` — or `null` on a page without tabs (the overview, a category) |
| `viewer`, `viewerHandle` | the handle the app writes as (`null` when none or invalid), and the text in Settings' box |
| `locale`, `theme` | `null` for the platform's language; `system`, `light` or `dark` |
| `warnInsteadOfRefuse`, `developmentMode` | the switch in Settings → Development, and whether the build has the mode at all and it is on: with it, another author's version, official without being a director and the shared library warn instead of refusing, and the bundled sample opens as an editable session copy |
| `editing` | the stems of the forms open for editing — what `set_field` can type into |
| `lastEvent` | the name of the last log event |
| `view` | the window's size in logical pixels and its pixel ratio (1.25 on a 125 % Windows display) |

Free text in the state — the handle, the project's name, its source and path — has e-mail addresses masked as `<e-mail>`.

### 4.2 A selection

What `navigate` takes and `state.selection` answers. `type` is the format's entity prefix, the first segment of a filename: `pj` project, `ch` character, `of` outfit, `lo` location, `pr` prop, `st` style, `mi` misc, `dc` document, `mo` model, `pl` platform, `pg` plugin, `fo` folder, `sc` scene, `sh` shot, `cu` cue, `cm` commentary, `rd` render batch (`EntityType` in `filmopen_format`; `docs/FilmOpen-Project-Specification v1.0.md` §5.4).

| Kind | Shape | Shows |
|---|---|---|
| overview | `{"kind": "overview"}` | the project overview |
| script | `{"kind": "script"}` | the Script page: what the project file in use holds, in order, and what is not in the script |
| category | `{"kind": "category", "type": "ch"}` | every entity of one type |
| entity | `{"kind": "entity", "type": "sc", "tag": "5", "epoch": null, "stem": null}` — `epoch` and `stem` optional | one entity: the epoch overview when no epoch is named, else the epoch's page on the version `stem` names, or the version in use |
| batch | `{"kind": "batch", "stem": "rd_8af0_maria"}` | one render batch record |
| other | `{"kind": "other"}` | the files the grammar does not describe |

A `stem` is a filename without its extension, `ch_main-hero_30yo_john123_v2`; an `epoch` is the epoch token of the filename (`30yo`); a `tag` the entity's tag (`main-hero`). The project's tree rows carry the same names: `find("tree:")` lists what is on screen.

### 4.3 A semantics node

What `semantics` answers as a tree and `find` as a flat list:

```json
{
  "id": 98,
  "identifier": "tree:lib/ch/main-hero/@30yo/john123_v3",
  "role": "…",
  "label": "john123 v3  from ch_main-hero_30yo_maria_v1",
  "value": "…",
  "valueWithheld": true,
  "hint": "…",
  "tooltip": "…",
  "flags": ["selected", "disabled", "button", "textField", "readOnly", "obscured", "inMutuallyExclusiveGroup", "hidden", "merged"],
  "actions": ["tap", "longPress", "scrollUp", "scrollDown", "scrollLeft", "scrollRight", "increase", "decrease", "setText", "focus", "dismiss", "expand", "collapse"],
  "rect": {"left": 73.0, "top": 491.0, "width": 304.0, "height": 28.0},
  "children": [ … ]
}
```

- `identifier`, `role`, `label`, `value`, `hint`, `tooltip` appear only when not empty; `flags` and `actions` hold only what applies.
- `rect` is on the view, in logical pixels — the same units as `tap_at` and `state.view`.
- A text field's **value travels only under the project's own identifiers** (`field:`, `epochs.`, `new-project.`, `new-entity.`, `settings.handle`, `tree.filter`, `dictation.`); elsewhere the node says `valueWithheld: true` (the account card's e-mail, one-time code and display name, and a provider key's box, among them). E-mail addresses are masked in every text.
- `hidden` marks a node scrolled out of view; `merged` a node folded into its parent (a button's inner text). A tab's node has its text on the label's first line and "Tab n of m" on the second.

### 4.4 A log event

`log_tail` answers the app's own log, event by event, as the log file writes it less what could quote a person's text:

```json
{"ts": "2026-09-14T10:27:23.489663Z", "level": "info", "event": "entity.saved", "data": {"stem": "ch_main-hero_30yo_john123_v2"}}
```

`ts`, `level` (`error`, `warning`, `info`, `debug`, `trace`), `event` (a dotted name), `data` (codes, stems, paths, counts — the app's structured data), and `errorType` when an error was logged (its message and stack stay in the file). The `account.*` events travel without their `data`. Events an agent will look for: `project.open` / `project.opened` / `project.refresh`, `entity.saved`, `entity.forked`, `official.set` / `official.cleared`, `pick.set` / `pick.abandoned`, `compare.copied` (with `keys`), `guard.overridden` (development mode let a write through), `settings.locale`, `flutter.error` and `dart.unhandled` (an exception on screen or in the app), `agent.announced`, `agent.timedOut`, `agent.finishedLate`, `agent.failed`, `agent.quit`, `agent.quitRefused`, `agent.settingsRestored`.

---

## 5. Error codes

An error result is `{"code": …, "detail": …}`, with `"launched": true` after a `launch` whose app is running, and `exitCode` / `output` on a failed launch.

### 5.1 From the app

| Code | Meaning | `detail` |
|---|---|---|
| `bad_args` | an argument is missing or malformed; checked before anything runs | the argument: `json`, `op`, `selection`, `kind`, `type`, `tag`, `epoch`, `stem`, `tab`, `key`, `text`, `id`, `label`, `x`, `y`, `query`, `lines`, `handle`, `code`, `theme`, `path` |
| `not_found` | nothing on screen or in the project answers to the name | the identifier; `label`; `position`; `field:<stem>:<key>`; `tab:<id>`; `<type>:<tag>`, `<type>:<tag>@<epoch>`, a stem; `project` (nothing open); `root` or `semantics` (nothing to paint or read yet) |
| `refused` | the app refused, as it refuses a click | `disabled` (a disabled control); a blocked tab's reason: `compareDisabledNoHandle`, `compareDisabledOwnLatest`, `compareDisabledReadOnly`, `blocked`; `drafts` (a quit while a draft cannot be written); `recording` (`record_start` while one runs) or `busy` (`record_start` or `record_stop` while one is starting or stopping); `idle` (`record_stop` while none runs) |
| `intercepted` | a question is on screen instead of what was asked (Compare's fork question) | the tab asked for |
| `not_available` | the host cannot do this: a product build's no-op host, or a host without label taps, quit or the issue recorder | the op; `record` for the three recorder ops |
| `timeout` | the op was not answered within 30 s | `queued` (it never ran, and never will) or `running` (it may still land; `log_tail` says so with `agent.finishedLate` or `agent.failed`) |
| `failed` | an unexpected failure | the error's type; `log_tail` has `agent.failed`; `recorder` for `record_start` or `record_stop` when the recording cannot start or its folder cannot be completed |
| `unknown_op` | no such operation | the name |

### 5.2 From the server

| Code | Meaning |
|---|---|
| `no_app` | no app to talk to: nothing launched, named or announced (`detail`: `launch`) |
| `no_connection` | the link failed or a request took longer than 45 s; the link is dropped and the next call reconnects (`detail`: the error's type) |
| `not_agent_build` | the app at the URL is a FilmOpen without the driver extension (an ordinary run) |
| `already_launched` | an app the server started is still running |
| `launch_failed` | `flutter run` ended (`exited`, with `exitCode`) or ran out of time (`timeout`) before the app answered; `output` holds its last lines, every token and e-mail address cut out |
| `no_repository` | the server cannot find the repository to run `flutter run` in |
| `bad_args` | `vmServiceUrl` not `http` on the loopback; `platform` not `windows`, `linux` or `android`; `device` empty, given on a desktop launch or missing on an Android one, or `size` or `home` given on an Android one (milestone 5.01); `size` not `<width>x<height>` within 320–4096, or `home` empty; a `path` the server may not write; `enter_text` without `text` |
| `timeout` / `quit` | the app was asked to quit and did not end within 30 s |
| `bad_reply` | the app answered something the server could not read |
| `shutting_down` | the call was still queued when the client left; it did not run |

---

## 6. The identifiers an agent acts on

Every control an agent drives carries a stable `Semantics(identifier:)`: never localised text, never an index that shifts. `find` lists the ones on screen; `tap` acts on them; `semantics` shows them in the tree. **Tabs carry none** — a tab is opened with `set_tab` — and a native dialog (the folder picker) is out of reach.

| Family | Identifiers | Where |
|---|---|---|
| The rail | `nav.project`, `nav.settings`, `nav.help` (the ?: opens the support dialog — `support.record` starts a recording, §7.12, `support.licenses` the open-source notices, `support.close` — and, while a recording runs, is the red stop button); `nav.tree` (only below 700 px of window, where the tree is a drawer behind its icon) | the left rail |
| The tree | `tree:<node id>` — `tree:project`, `tree:script`, `tree:script/fo:s1/fo:e2/sc:5` (a row of the script is its parent's id and the entry: a folder or a scene by its short name, a pinned entry by its full stem — and, since an entry is whatever a file wrote, a `%`, a `/` or a `#` in it as `%25`, `%2F`, `%23`, so that no entry spells another row's id; `tree:unfiled/…` under *Not in the script*), `tree:lib/ch`, `tree:lib/ch/main-hero`, `tree:lib/ch/main-hero/@30yo`, `tree:lib/ch/main-hero/@30yo/john123_v2` (rows are path-like; `find("tree:")` lists what is built); a row of the script has a menu, `tree:<node id>.menu` — built while the row is selected or under the pointer, so `tap` the row first — whose items are the same on every row, one menu being open at a time: `tree.add-folder`, `tree.add-scene`, `tree.move-up`, `tree.move-down`, `tree.move-to`, `tree.remove` (an item the viewer may not use, or that has nowhere to go — *Move up* on a first row — is disabled, and `tap` refuses it; a row under *Not in the script* offers `tree.move-to` alone); `tree.filter`, `tree.expand-all`, `tree.collapse-all` | the tree pane — below 700 px of window it exists only while the drawer is open: `tap nav.tree` first, and a tap on a row closes it |
| The project menu | `project.menu`; its items `project.new`, `project.open`, `project.copy-to-folder`, `project.reread`, `project.sample`, `project.recent:<path>` | the ⋮ menu of the tree pane (in the drawer below 700 px) |
| A version's reference images | `media.add`, `media:<stem>:<n>` (the n-th tile of the version on screen), and, in the sheet the **+** opens, `media.browse` (a native file dialog, which no tool reaches), `media.url`, `media.import`, `media.cancel`; in the viewer a tile opens, `player.close`, `player.reveal` (absent where the file is not on this machine) and, for a clip or a sound on a platform that plays one, `player.play` / `player.pause` — the same control, named for what pressing it does next — and `player.seek`, the seek bar, which `find` lists and no op moves: a slider's node carries increase and decrease and no tap, so `tap` refuses it as `disabled` | adding a reference and looking at one (§9.0). An agent uploads through `media.url`: `tap` the box, `enter_text` the address, `tap media.import`. A picture served from `127.0.0.1` is how a check uploads without a file dialog and without anything leaving the machine. In the **web preview** that server must send `Access-Control-Allow-Origin: *`, or the browser refuses the fetch before the application sees it; the Windows and Linux builds need no such header |
| New project | `new-project.folder`, `new-project.browse`, `new-project.tag`, `new-project.title`, `new-project.username`, `new-project.media-folder`, `new-project.media-browse`, `new-project.media-kind`, a registered source's own panel (Google Drive's `new-project.google-drive.sign-in`, `.sign-out`, `.parent`, `.name`), `new-project.cancel`, `new-project.create` | the New project dialog (`browse` and `media-browse` open a native picker, which no tool reaches; `media-kind` appears only when more than one kind of media root can be made) |
| The script's contents | `contents.add-folder`, `contents.add-scene`; a row `contents:<entry>`, the entry as the list writes it (`contents:fo_f1`, `contents:sc_5_maria_v1`; a second equal entry carries `#2`, and a `%` or a `#` the entry itself writes is `%25` or `%23`), which opens the row's page; its menu `contents:<entry>.menu` with `contents.move-up`, `contents.move-down`, `contents.move-to` and `contents.remove` | the Script page (`{"kind": "script"}`) and a folder's page on *View/Edit*; the buttons are disabled, and `tap` refuses them, on a version that is not the viewer's |
| The move dialog | `move.to:<the tree's row id>` — `move.to:script`, `move.to:script/fo:s1/fo:e2`: *Script* and the folders the viewer may change, without the moved folder, what is beneath it and any other folder it holds —, `move.confirm` (refused until a row is chosen), `move.cancel` | after `tree.move-to` or `contents.move-to`; the entry goes to the end of the one chosen. **A drag is not an agent's**: rows of the script can be dragged with a mouse or a finger, and every move a drag makes is one of these menu items — a drop *into* a folder is `move-to`, a drop between rows `move-up` / `move-down` or `move-to` and then those. A move between two folders writes the destination first: `log_tail` shows `folder.childMoved`, or `folder.childMoveHalfDone` where the origin could not be written and the entry is listed twice |
| A folder's form | `field:<stem>:name`, `:kind` (chips: `set_field` it with a token, or nothing to remove it), `:synopsis`, `:notes` | a folder's page (`{"kind": "entity", "type": "fo", …}`) on the viewer's own version |
| A scene's form | `field:<stem>:name`, `:synopsis`, `:location` and `:epoch` (pull-downs: `tap` opens the menu and `tap {"label": …}` chooses, or `set_field` a short name, or nothing to remove the key — a name the project does not have writes nothing), `:cast` (`set_field` one short name per line: the entries that stay keep their `epoch`, `outfit` and `notes`, and a name that is neither a character of the project nor in the scene already refuses the whole text), `:notes`; a character's row `cast:<stem>:<index>` with `.remove` and, where the project declares more than one epoch, `.epoch` (a pull-down); `cast:<stem>:add`, whose menu's items are `cast:<stem>:add.<short name>` | a scene's page (`{"kind": "entity", "type": "sc", …}`) on the viewer's own version; on another's the same identifiers are there, locked, without `.remove`, `.epoch` and `add` |
| The new-entity dialog: a character, a location, a folder, a scene | `category.add` opens it on the Characters and Locations pages, and `contents.add-folder` / `contents.add-scene` or a row's `tree.add-folder` / `tree.add-scene` for the script; its boxes are `new-entity.name`, `new-entity.tag` (for a folder or a scene already filled in with the next number — `f1`, `2` — and overtypable), `new-entity.username`, `new-entity.kind` (a pull-down: a character's and a location's kinds; **a folder's with *None***; **a scene has none**), `new-entity.epoch` (a character or a location only, and only where the project declares several epochs), `new-entity.cancel`, `new-entity.create` (refused, with the reason as its tooltip, while a box is not good) | a category page (`tree:lib/ch`, `tree:lib/lo`), the Script page, a folder's page or the tree, and the dialog each opens |
| The version row | `version.official` (the director's star), `version.pick` (the check), `version.label`, `version.fork`; the label dialog's `label.text`, `label.cancel`, `label.save` | an entity page's header |
| The file menu | `file.menu`; `file.edit-json`, `file.show-in-folder`, `file.copy-json`, `page.plugins` (milestone 5.1) | the *More* menu of the form; `page.plugins` where an enabled plug-in's `transform` applies to the type, on a project that can be written |
| *Plugins…* (the dialog) | `page.plugins.<tag>.transform`, `page.plugins.cancel` (while one runs), `page.plugins.answer` (its label: the new version, or why nothing was written), `page.plugins.open` (the version it wrote), `page.plugins.close` | after `tap page.plugins`; closing the dialog while a run goes on stops it |
| The form's fields | `field:<stem>:<key>` — the file's stem and the field's key: `field:ch_main-hero_30yo_john123_v2:summary` | *Edit* and *View* (locked) |
| The epochs editor | `epochs.add`; per epoch `epochs.<tag>.label`, `epochs.<tag>.year`, `epochs.<tag>.remove`; the add dialog `epochs.add-tag`, `epochs.add-label`, `epochs.add-year`, `epochs.add-cancel`, `epochs.add-confirm` | the project file's form |
| The official banner | `banner.fork` | above a form editing what official names |
| Compare | `compare.copy-all` (`<<<`), `compare.copy-section:<section id>` (`<<`; ids `details`, `epochs`, `attributes`, `blocks`, `other`), `compare.copy-row:<field id>` (`<`; the field's key, `compare.copy-row:summary`); the fork question's `compare.fork-yes`, `compare.fork-no`, `compare.fork-reread` | the Compare tab |
| The autosave | `draft.retry`, `draft.discard` (*Discard my changes and re-read*, after a stale refusal) | the save status |
| Development mode's red lines | `guard.<notice>`: `guard.noHandle` (opens Settings), `guard.sessionCopy` (*Copy to a folder…*), `guard.readOnlySample` (*Open the sample again*) — the other notices carry no action | above a page's header |
| A stale pick | `pick.abandon`, `pick.keep` | the banner a pick the project overtook raises |
| The JSON editor | `json.save`, `json.cancel`, `json.reread`, `json.discard`, `json.discard-cancel` | *Edit JSON…* |
| Settings | `settings.theme`, `settings.language`, `settings.handle`, `settings.verbose-logs`, `settings.warn-instead-of-refuse` | the Settings page (the last two sit below the fold on a 720 px window, and no tool scrolls Settings) |
| Settings → Provider keys | `settings.speech-service`, the *Speech service* pull-down above the keys (a `tap` opens its menu, and `tap --label` with a line as the menu reads it chooses the service; `quit` puts the choice back); `keys.<owner>.<slot>` (milestone 5.1: `keys.app.openai`, `keys.default-ai-assist.openrouter`, `keys.default-ai-assist.fal`; `keys.app.xai` beside OpenAI's since 18 September 2026), `keys.<owner>.<slot>.key`, `.key.show` (the eye that shows what was pasted and hides it again, milestone 5.01; disabled while the card is busy or a recording runs), `.save`, `.remove`, `.guide`, `.keys-page`, and `.answer`, the line a save's check leaves under the boxes, which is there only once a save has been made; `keys.remove.cancel` and `keys.remove.confirm` in *Remove*'s dialog, `keys.replace.cancel` and `keys.replace.confirm` in *Save*'s; `keys.platforms` | after `set_tab keys` on Settings, which opens on `general` each time; a key's box is obscured unless its eye shows it, and its value never travels either way, `keys.` being outside `valueIdentifiers`; a picture shows what the screen shows. These names replaced milestone 4.9's `keys.<platform>.*` — the one identifier rename so far, accepted by the owner on 17 September 2026 with no alias, since the old names had been on `main` a day and nothing outside the repository used them (the milestone 5.1 note's D37) |
| Dictation, on any box with a microphone | `<box>.dictate`, and beside it `<box>.dictate-menu` where the box has room (not the tree's filter, the epochs editor's rows, or a form drawn in one column); in the menu `dictation.device:default`, `dictation.device:<id>`, `dictation.hold` | a tap opens the popup; *Hold to record* is a person's gesture, not an agent's |
| The dictation popup | `dictation.menu`, `dictation.status`, `dictation.text`, `dictation.replace`, `dictation.insert-at-cursor`, `dictation.rewrite`, `dictation.stop`, `dictation.resume`, `dictation.cancel`, `dictation.apply`, `dictation.open-keys` | the values of `dictation.` identifiers travel, as a project field's do; the agent build records from a fake microphone that talks in phrases — 2.5 s of syllables, then 1.5 s of quiet — and a script answers it, a turn a second and another at each phrase's end |
| Settings → Usage | `usage.month`, `usage.totals`, `usage.uses` | after `set_tab usage` on Settings |
| Settings → Plugins | `plugins.install`, `plugins.prefer.text`, `plugins.prefer.media` (pull-downs), `plugin:<tag>` (a plug-in's card), `plugin:<tag>.enabled`, `plugin:<tag>.open`; in the consent dialog `plugins.consent` (what it asks for, as a node to read — the keys, the hosts, the servers and the calls, each in the words of the plug-in they belong to), `plugins.consent.allow`, `plugins.consent.cancel`; on a plug-in's page `plugins.back`, `plugin:<tag>.<key>` (a machine setting: a box, a switch or a pull-down), `plugin:<tag>.action.<id>`, `plugin:<tag>.action.cancel`, `plugin:<tag>.answer` (the last action's answer, a value), `plugin:<tag>.grant.<owner>:<slot>` (a checkbox) | after `set_tab plugins` on Settings; a machine setting's box takes `set_field plugin:<tag> <key> <text>` |
| A plug-in's card on a page | `field:<stem>:plugins.<tag>.<key>`, and in Compare `compare.copy-row:plugins.<tag>.<key>` and `compare.copy-section:plugin:<tag>` | on a character, a location or the project file, for each enabled plug-in whose settings name the type |
| Settings → General's About card (milestone 5-2) | `settings.plugin-dev`, which opens the plug-in developer page; `settings.plugin-dev-folder`, the box holding the folder of plug-ins being written — typed, entered or left behind — with `settings.plugin-dev-folder-choose` (the folder picker, a native dialog **no tool can answer**) and `settings.plugin-dev-folder-clear`, there only once a folder is named | on a **desktop** build where plug-ins run at all, release builds included; absent on the web and on a phone. Both sit at the foot of Settings → General, so a window has to be tall enough for them to be built at all — `launch` at `1200x1600`, or `find` answers nothing and `tap` `not_found` |
| The plug-in developer page (milestone 5-2) | `plugin-dev.plugin` and `plugin-dev.function` (pull-downs), `plugin-dev.function-name` (the box under *Other…*, there only while that is the choice), `plugin-dev.mode` with its chips `plugin-dev.mode.app` and `plugin-dev.mode.typed` (milestone 5-2b: *As FilmOpen calls it*, the default, and *Exactly what I typed*), `plugin-dev.folder-problems` (there only while a plug-in of the development folder cannot be read), `plugin-dev.args` (the JSON box), `plugin-dev.source` (there only as FilmOpen calls it: as typed, nothing is saved), `plugin-dev.call`, `plugin-dev.cancel` (there only while a call runs), `plugin-dev.result`, `plugin-dev.result-file`, `plugin-dev.log`, `plugin-dev.log:<n>` (a row), `plugin-dev.log-clear`, `plugin-dev.log-file`, `plugin-dev.close` — the two `…-file` rows name a plug-in's own files, so they are there once one is chosen and not before | opened by `settings.plugin-dev`, or by `plugin:<tag>.dev` on a plug-in's own page, which opens it on that plug-in. It takes `set_field plugin-dev plugin|function|args|mode`, `mode` being `app` or `typed`; a plug-in it does not list, or a function that plug-in does not expose, is refused rather than guessed. **`plugin-dev.args` is outside `valueIdentifiers`**: it is the one box a developer may paste a key into to try a request, so what is typed there is never read back — by an agent or into a recording. The plug-in, the function and *Other…*'s own `plugin-dev.function-name` do travel, being names; the two `…-file` paths travel to an agent and are kept out of an issue report, since an app-support path names the person on Windows |
| The account | `account.login`, `account.send-code`, `account.name` | Settings' account card and the sign-in dialog — never used by an agent |

### 6.1 The fields `set_field` can type into

A field takes text only where a person types text; the key is the one its identifier ends with.

| Form | Keys that take text | Controls that take none |
|---|---|---|
| A project file (`pj_…`) | `name` (required: an empty text is an inline error, not a removal), `kind` (one of `short-film`, `film`, `mini-series`, `series`, or `""` to remove it; also a pull-down with *None*), `year`, `rating`, `logline`, `synopsis` | `genre` (a picker), `epochs` (the editor) |
| A character (`ch_…`) | `name`, `birthdate` (a year or a date; an invalid one is an inline error and writes nothing), `appearance.age` (a number, or a phrase), `summary`, `aliases` (comma-separated), `arc`, `defaultOutfit`; every typed key of A.1 by its dotted path — `appearance.face`, `appearance.hair.color` / `.length` / `.style` / `.texture`, `appearance.eyes.color` / `.shape` / `.notes`, `appearance.skin`, `appearance.facialHair`, `appearance.teeth`, `appearance.glasses`, `appearance.gender`, `appearance.species`, `appearance.ethnicity`, `appearance.heightCm` and `appearance.weightKg` (a number; other text writes nothing), `appearance.build`, `appearance.posture`, `appearance.gait`, `appearance.hands`, `appearance.jewellery`, `appearance.marks` (one item per line, `\n`-separated), `appearance.notes`, `personality.summary`, `personality.traits` and `personality.mannerisms` (lines), `personality.wants` / `.needs` / `.fears` / `.speech`, `voice.description`, `voice.pitch` and `voice.pace` (chips: the token, `low`, `very-high`; an empty text removes it), `voice.timbre`, `voice.accent`, `voice.lang`, `prompt.positive`, `prompt.negative`, `creatorNotes` (milestone 4.7) | `kind`; `relationships` (rows of boxes: `relationships:<stem>:add`, then `tap` `relationships:<stem>:<n>.character` / `.relation` and `enter_text`; `relationships:<stem>:<n>.remove`) |
| A location (`lo_…`) | `name`, `within` (a tag of another location; one no other location has writes nothing; `""` removes it — it is also a pull-down: `tap` its identifier, then the location's name by label), `aliases` (comma-separated), `description`, `era`, `architecture`, `areas` (lines), `geography.city` / `.region` / `.country` / `.coordinates`, `access`, `timeOfDay` (chips: the token, `golden-hour`), `weather`, `dressing` and `palette` (lines), `lighting.default`, `lighting.practicals` (lines), `lighting.windows`, `sound.roomTone`, `sound.ambience`, `prompt.positive`, `prompt.negative`, `creatorNotes` (milestone 4.7) | `kind` |
| A folder (`fo_…`) | `name`, `kind` (chips: a token of the vocabulary — `season`, `installment`, `episode`, `act`, `arc`, `sequence`, `part`, `chapter` — or any other word, kept as written; `""` removes it), `synopsis`, `notes` | what the folder holds: the Contents card above the form (`contents.*`), never a field |
| A scene (`sc_…`) | `name`, `synopsis`, `location` and `epoch` (a short name the project has, or `""`; also pull-downs), `cast` (one short name per line: the entries that stay keep their `epoch`, `outfit` and `notes`; a name that is neither a character of the project nor in the scene refuses the whole text), `notes`; a plug-in's `plugins.<tag>.<key>` | the blocks (read-only rows; writing dialogue is not built), a character's own epoch (`cast:<stem>:<index>.epoch`, a pull-down, only where the project declares more than one epoch) |
| Every other type | none yet: the page shows every value locked (a milestone 5 form adds keys, never renames them) | — |
| The plug-in developer page (`plugin-dev`) | `plugin` (a plug-in's stem or its tag), `function` (a name that plug-in exposes, or `Other…`'s own box), `args` (the JSON a call is given), `mode` (`app`, as FilmOpen calls it, or `typed`) | *Call* and *Stop* (`plugin-dev.call`, `plugin-dev.cancel`), which are taps |

**`typed` says the field took the text, not that the file changed.** A field that holds one word out of a list — a project's `kind`, a scene's `location` and `epoch`, a location's `within`, a plug-in's pull-down — writes nothing for a word its list does not have, and a scene's `cast` nothing for a text that names somebody the project does not have: never a guess. `set_field` still answers `{"typed": true}`; read the file back where it matters. A project's `kind` takes a 1.4 spelling (`franchise`) and writes the kind it means (`series`). A key whose value in the file has another shape than its box (an object where a word goes, `appearance` written as a sentence) takes the text and writes nothing: `set_field` answers `{"typed": true}` and the file is unchanged, as a person's typing into that locked box would be — read the file back, or `find` the field's helper. **Do not `tap` a chip row's `field:` identifier** to bring it into view: the tap lands on the row where a click would, which is on a chip, and chooses it; `set_field` it instead. The relationship rows are numbered as they stand on screen, where a row emptied while it is retyped keeps its place until its `.remove`: `relationships:<stem>:<n>` is the n-th row on screen, not necessarily the n-th object of the file.

A form is open for editing only on a version the viewer may write: the viewer's own (`set_viewer` first), or anybody's in development mode. `state.editing` lists the stems that have a form open; `set_field` on any other stem is `not_found`.

---

## 7. Recipes

Every recipe assumes the server is registered (§2.2). Read `state` after any step that changes something — every acting tool answers it — and `log_tail` when a write should have landed.

### 7.1 Start, look, stop

1. `launch` → the state: the bundled sample, `project.canWrite` true only if development mode is on (§8.1) — on Linux a launch without `home` starts with fresh preferences, so it is on and the sample is a writable session copy.
2. `page_shot` to see the page; `find("tree:")` to see the rows on screen; `state.selection` to know what is shown.
3. `stop` → `{"stopped": true, "by": "quit"}`. Nothing is left running.

### 7.2 Open a project you can write

The bundled sample is **read-only unless development mode is on**, and even then it is a session copy in memory. To write to files on disk, open a folder:

1. Copy a project folder somewhere the app may write (the sample's `assets/sample/the-cartographer` and its media folder `the-cartographer-data` side by side, if you want the sample's content).
2. `open_project` `{"path": "<folder>"}` → the state names it with `canWrite: true` and `sessionCopy: false`.
3. `set_viewer` `{"handle": "john123"}` — the author whose versions you may edit; the sample's authors are `john123` and `maria`.

Or `launch` `{"project": "<folder>"}` to do the first two in one call.

### 7.3 Navigate and read a page

```
navigate {"selection": {"kind": "entity", "type": "ch", "tag": "main-hero", "epoch": "30yo", "stem": "ch_main-hero_30yo_john123_v2"}}
→ state.tab = "data", state.editing = ["ch_main-hero_30yo_john123_v2"]   (Edit: the viewer's own version)
find "version."   → version.official, version.pick, version.label, version.fork, each with its rect and actions
semantics         → the whole page, values under field:… included
page_shot         → the page as an image
```

`navigate` to a version another author wrote gives `state.editing = []`: the page is *View*.

### 7.4 Edit a field

```
set_field {"stem": "ch_main-hero_30yo_john123_v2", "key": "summary", "text": "…"}   → {"typed": true}
(wait about a second)
log_tail {"lines": 5}   → … "entity.saved" {"stem": "ch_main-hero_30yo_john123_v2"}, then "project.refresh", "project.open", "project.opened"
```

A refusal after the write — the file changed on disk meanwhile — shows in the save status with `draft.retry` or `draft.discard`; `log_tail` has `entity.saveFailed`. `set_field` on `kind` is `not_found`: a pull-down takes no text — `tap` its `field:` identifier (the menu opens) and then `tap {"label": "<the item's label>"}`.

### 7.5 Compare two versions and copy a row

Compare puts the viewer's latest version on the left and the version on screen on the right, and copies right to left.

```
navigate to another author's version (the right column), e.g. ch_main-hero_30yo_maria_v1
set_tab {"tab": "compare"}          → {"tab": "compare"}
find "compare.copy-row"             → the rows that differ, e.g. compare.copy-row:summary
tap {"id": "compare.copy-row:summary"}   → tapped; the left column's autosave writes it
log_tail                            → "compare.copied" {"stem": <the left version>, "from": <the right version>, "how": "row", "keys": ["summary"]}, then "entity.saved"
```

- `compare.copy-section:<id>` copies a card, `compare.copy-all` every copyable key; neither removes anything.
- `set_tab compare` on the viewer's own latest version is `refused` / `compareDisabledOwnLatest` (there is nothing to put on the left); without a handle `compareDisabledNoHandle`; on a read-only project without an own version `compareDisabledReadOnly`. In development mode the tab opens instead and says its reason as a red line.
- On a writable project where the viewer has no version at that epoch, `set_tab compare` is `intercepted`: the app asks whether to fork the version on screen. `tap {"id": "compare.fork-yes"}` forks and opens Compare; `compare.fork-no` returns to the file's data.

### 7.6 Fork, pick, official

All three are taps on the version row of the page on screen:

| Do | Tap | Then |
|---|---|---|
| Fork the version on screen | `version.fork` | the state names the new stem (the viewer's next version number, forked from the page's version); `log_tail` has `entity.forked` (`from`, `to`) and `pick.set`; the new version is the viewer's pick |
| Use this version (the pick) | `version.pick` | `pick.set`; on the official version it abandons the viewer's pick (`pick.abandoned`) and follows the star; on the version already in use it only says why (a message, nothing written) |
| Make it official / clear official | `version.official` | `official.set` or `official.cleared`; directors only (`refused` / `disabled` for anyone else, unless development mode lets it through with `guard.overridden`) |

`refused` / `disabled` is what a person sees as a greyed control: no handle, a read-only project, the library, or not a director.

### 7.7 The label, the JSON editor, a new project

The dialogs' text boxes are not form fields, so `set_field` does not reach them; `enter_text` does, into the box last tapped, replacing what it holds. `screenshot` and `page_shot` both show a dialog now.

- **A version label:** `tap version.label` → the dialog; `tap label.text`, `enter_text {"text": "…"}`, `tap label.save`. `label.cancel` leaves it.
- ***Generate*, when it is built** (the plan's architecture test; not in 5.1): the button beside *Browse* on a reference section will make one call, `PluginRuntime.call('render', {model, prompt, inputs, params}, source: entity)`, and add no op of its own. An agent will drive it as a person does: `tap` its identifier, then poll `find media:<stem>:` until the new tile is there and `log_tail` has `media.imported` with the plug-in's renderer; a `render` in progress is stopped as *Plugins…* stops a rewrite. No key is typed for it: the preferred media plug-in's key is sent at the door.
- **A plug-in's rewrite** (milestone 5.1): on a version page, `tap file.menu`, `tap page.plugins`, `tap page.plugins.<tag>.transform`; poll `find page.plugins.answer` until its label says *Written: <stem>.* (or why not); `tap page.plugins.open` shows that version, `<viewer>.<tag>`'s, beside the viewer's own, which is untouched. `tap page.plugins.cancel` stops a run, and nothing is written.
- **The JSON editor:** `tap file.menu`, `tap file.edit-json` → the editor with the file's text; `tap` its box, `enter_text` the whole new text (it replaces, never inserts), `tap json.save` — the editor's own guards apply (identity, duplicate keys, a stale file offers `json.reread`); `json.cancel` leaves, `json.discard` after a change.
- **A provider key** (Settings → Provider keys): `tap nav.settings`, `set_tab keys`, `tap keys.<owner>.<slot>.key` (`keys.app.openai.key`), then `enter_text` a **visibly fake** value, since the text passes through the client's transcript. The agent build keeps keys in memory and checks them with a stub: a value ending `-ok` is verified, `-bad` rejected, and anything else could not be checked. `tap keys.<owner>.<slot>.save`; when *Save* asks first (a stored key, or a value that looks like another platform's), `screenshot` shows the question, answered with `keys.replace.confirm` or `keys.replace.cancel`. What the platform answered is then `keys.<owner>.<slot>.answer`, and the key is stored only where that answer was yes.
- **A plug-in** (Settings → Plugins): `tap nav.settings`, `set_tab plugins`, `find plugin:` lists the plug-ins; `tap plugin:<tag>.enabled` turns one on — a plug-in that is not FilmOpen's opens the consent dialog, answered with `plugins.consent.allow` or `plugins.consent.cancel`; `tap plugin:<tag>.open`, then `set_field plugin:<tag> <key> <text>` for a machine setting, `tap plugin:<tag>.action.<id>` and `find plugin:<tag>.answer` for its answer (a plug-in turned on a moment ago may still be loading: a refused tap is retried), and `tap plugin:<tag>.grant.<owner>:<slot>` for a key. An entity setting is a form field: `set_field <stem> plugins.<tag>.<key> <text>`, a pull-down taking one of its tokens and a switch `true` or `false`.
- **A dictation**: `tap <box>.dictate`; on a box with text, `tap dictation.replace` or `dictation.insert-at-cursor` first. The agent build's script adds a turn each second, read through `dictation.text`; `tap dictation.apply` puts the text in, or `dictation.cancel` leaves the box alone. Either way the usage chain ends, and `set_tab usage` on Settings shows it. Where the popup says there is no key, or that OpenAI refused it, `tap dictation.open-keys` closes the popup and any dialog under it and opens Settings → Provider keys; a dialog that guards its changes (the JSON editor's) asks first, and the page stays while it is open.
- **A new project:**

```
tap {"id": "project.menu"}          (below 700 px of window: tap {"id": "nav.tree"} first — the menu is in the tree pane)
tap {"id": "project.new"}
tap {"id": "new-project.folder"}    enter_text {"text": "<the parent folder>"}    (or new-project.browse, a native picker no tool reaches)
tap {"id": "new-project.tag"}       enter_text {"text": "walkprobe"}
tap {"id": "new-project.title"}     enter_text {"text": "Walk Probe"}
tap {"id": "new-project.username"}  enter_text {"text": "john123"}
tap {"id": "new-project.create"}    → the state names "Walk Probe", canWrite true, and its selection is the first scene, sc_1_john123_v1; <parent>/walkprobe holds filmopen-project.json, pj_walkprobe_john123_v1.json and sc_1_john123_v1.json
```

The dialog asks no kind (since milestone 5.11; a project's kind is set on its page, `field:<stem>:kind`, a pull-down that takes `set_field` with one of §8.1's words or nothing). The short name follows the title until something is typed into `new-project.tag`, so an agent that types the tag — before or after the title — gets the tag it typed. `new-project.media-folder` is where the film's media will live (§4.4), pre-filled as `<parent>/<tag>-data` and following the tag until something is typed into it — emptied, the project folder is its own media root; a media kind other than the local folder shows that source's own panel in place of the folder row, and Google Drive's is a sentence about the scope, `new-project.google-drive.sign-in` — which opens the person's own browser and is theirs alone to complete, never an agent's — and then `.sign-out`, `.parent` (a pull-down of the folders FilmOpen made) and `.name`; `new-project.cancel` leaves. An agent that would rather not drive the dialog writes the files with the format's rules and `open_project`s the folder.

- **A new character or location:**

```
tap {"id": "tree:lib/ch"}           (tree:lib/lo for a location)
tap {"id": "category.add"}
tap {"id": "new-entity.tag"}       enter_text {"text": "sidekick"}
tap {"id": "new-entity.name"}      enter_text {"text": "Tomas"}
tap {"id": "new-entity.username"}  enter_text {"text": "john123"}    (pre-filled from Settings)
tap {"id": "new-entity.create"}    → the page of ch_sidekick_<default epoch>_john123_v1, on Edit
```

`new-entity.kind` and `new-entity.epoch` are pull-downs; a tag the type already has keeps `new-entity.create` disabled (`disabled`).

### 7.8 The settings

`set_viewer`, `set_locale`, `set_theme` are Settings' doors and answer the state. `set_locale {"code": "es"}` switches every string on screen; the identifiers do not change, and `set_tab` still takes `compare`. Development mode's switch (`settings.warn-instead-of-refuse`) sits below the fold of the Settings page on a 720 px window, where no tool scrolls: on a machine where it is off, use a folder project (§7.2) rather than the sample.

### 7.9 Ending a session cleanly

`stop` sends `quit`: the app writes its open drafts, ends any open dictation, puts back the viewer, language, theme, development mode and dictation's microphone, *Hold to record* switch and speech service the session started with (every FilmOpen build on a Windows machine shares one preferences file; on Linux a launched app has folders of its own, removed with it), removes `agent.json`, and exits; the server then ends `flutter run` — on Linux the whole process group it started, `Xvfb` included. `by` says what ended it. A `refused` / `drafts` means a draft could not be written (the file changed on disk): `tap draft.discard` (or `draft.retry`), then `stop` again. A client that disconnects without `stop` has the app it launched quit the same way, with short waits.

### 7.10 Widths: proving a layout

`launch {"size": "<width>x<height>"}` gives the view that size on both runners — to the pixel on Linux, to within a pixel on Windows and never short (§3.1, §8.5) — and `state.view` confirms it. The layout's breakpoints (Software Specification §9.1) are in **window** width: at 700 the tree is still beside the page — the tightest such layout — and strictly below 700 it is a drawer behind `nav.tree`; a form goes to one field per row below 560 px of pane. So a critic asks for `1200x800` and `700x800` with the tree on screen, and `532x800` or `375x800` for the drawer and the one-field rows, and reads each layout from `page_shot`. Two launches in a row need a `stop` between them (`already_launched` otherwise), and on Linux each gets a display and folders of its own.

### 7.11 The acceptance walk, scripted

`test_plans/run_mcp.py` reuses the walk's client to run the numbered test plans of `test_plans/` (a project versioned between two users; a character and a location added, edited, versioned and compared; Provider keys, dictation into a character's summary and Settings → Usage; Settings → Plugins and a plug-in's card; and, since 1.7, two plug-ins of the runner's own in a development folder — an address typed into a `server` setting and a call from one plug-in to the other — and `090_plugin-dev-page.md`, the developer page end to end, which the walk also reaches with a step of its own; and, since 1.6, `070_folders.md`: a folder, two scenes, a scene's location and cast, *Move up*, *Move to…*, *Remove*, *Not in the script*, filed again), checking the files they write and what the screen and the log say. `scripts/agent_walk.py` is §7.1–§7.9 as a script (since 1.6 with §7.13's folder step after its new project — the project opening on its first scene, a folder added on Script, a scene added in it, the scene moved to Script through the move dialog): it spawns the server, speaks MCP to it, and prints PASS or FAIL per step — the state at a size, a page shot, the viewer, `set_field` and its `entity.saved`, the Compare gate under the rules in effect (development mode's warnings, a debug build's where the preference was never chosen, open Compare on the viewer's own latest and let another author's version be edited under a red line; the release rules refuse both; the walk checks that the two answers agree, and that they are the rules the shared preferences name, or, with no preference, a debug build's default, the warnings) and a copied row, a fork on disk, Spanish and dark in a picture, a new project through its dialog with `enter_text`, the refusals, and a clean `stop` (on Linux, no `Xvfb` or `flutter run` left). Without `--project` it copies the bundled sample to a temp folder, and the project its dialog creates goes to a temp folder of its own, removed at the end: nothing of the person's is written, except a fork and a typed summary into a `--project` folder they name; on Windows it reads the shared preferences before and puts them back after (removed, if there were none).

```
python3 scripts/agent_walk.py                                  # this machine's platform, 1280x720
python3 scripts/agent_walk.py --platform linux --size 700x800
python3 scripts/agent_walk.py --size 532x800 --out /tmp/walk-532               # the pictures somewhere else
python3 scripts/agent_walk.py --platform android --device emulator-5554        # on a device
python test_plans/run_mcp.py --platform android --device R5CX33J7ENR           # the plans, on a phone
```

**Where the results go.** Both runners write their pictures and the server's log to `mcp_test_results/<branch>/<walk or plans>-<platform>-<device or size>/` in the checkout unless `--out` names another folder — `mcp_test_results/main/walk-android-R5CX33J7ENR/`, `mcp_test_results/main/plans-linux-1280x1400/` — so a branch's results are found by its name and a phone's, an emulator's or two widths of a desktop never overwrite each other. The folder is ignored by git: results stay on the machine that ran them and are never committed.

It needs Python 3 and the Flutter SDK, and exits with the number of failures; **on a device it needs `adb` too** — on `PATH`, or through `ANDROID_HOME` / `ANDROID_SDK_ROOT`, which is what `flutter doctor` reads, and a run without it says so rather than failing with a traceback. Run it after any change to the layer, on **all three** platforms.

**On a device** (`--platform android --device <serial>`, milestone 5.01 step 4b) both runners differ in four ways and in nothing else, and each prints what it is doing:

- **Where the project is.** A phone keeps its projects inside the app's own sandbox, so the walk copies the sample in through `adb shell run-as ai.filmopen.app` — `adb push` cannot write there and the app cannot read `/data/local/tmp` — and every check that reads a project's file reads it back the same way. The plans create theirs in the app's own `projects/`, which is where *New project* puts them; the dialog names no folder there, so neither runner types one.
- **Where the URL door fetches from.** A phone's `127.0.0.1` is its own, so a runner runs `adb reverse tcp:<port> tcp:<port>` before it launches, and the address it types is unchanged.
- **What a short screen can reach.** A control below the fold has no semantics node and no op scrolls, so a check whose row is off the screen is **skipped with the reason**, naming the identifier and the width — never reported passed. At 411–426 dp that is the plans' per-row and per-section copy-left on a character and a location, and the third key card, fal's, in 050-2 and 060-4. `scroll_to` is what closes this. Plan 050-5's menu of microphones is skipped on a phone for another reason: the menu stands beside the microphone only where the box has room, and a form one field to a row gives it none (Software Specification §9.6; `entity_form.dart`), and the runner says so.
- **The screen stays on.** A locked phone, or one whose screen has gone off, draws no frames, and the driver waits for one: `launch` answers `no_connection` and every call after it fails, while the app keeps running. A device run needs the screen unlocked and awake for its whole length (Developer options → *Stay awake* while charging); a runner whose launch fails on a device says so.
- **What the tree is.** Below 700 px the tree is a drawer, and its rows and the project menu exist only while it is open: a runner opens it when it reaches for one and closes it the way a person does, by tapping a row, `nav.tree` only opening.

A device's clean run is therefore **0 failures with a handful of skips**, each naming its reason; a desktop's is 0 failures with none in the plans and, in the walk, at most one: the real clip, skipped on Linux, which has no player (Software Specification §9.3), and on a Windows machine with no clip of its own to serve. Nothing of a device outside the app's own package is ever addressed: `adb devices`, `reverse`, `shell run-as ai.filmopen.app`, `shell pidof`, and `flutter run -d <serial>` — and `forward --list` / `forward --remove`, with which a runner gives back the host ports `flutter run` forwarded to the app's VM service during the run and leaves behind however it ends; a forward that was there before the run is not touched.

### 7.12 Record and replay an issue

The issue recorder (Software Specification §6.8) turns what a person does into a tape a support agent can replay through this same control:

```
record_start                        → {"recording": true, "folder": …}
… the person reproduces the problem …
record_stop                         → {"recording": false, "folder": …, "events": n}
python scripts/replay_tape.py <folder>
```

`record_start` refuses `recording` while one already runs and `busy` while one is starting or stopping; `record_state` answers whether one runs without changing anything. The folder `record_start` and `record_stop` answer is masked, as every path is; it names `<reports folder>/<YYMMDDHHMMSS>/`, beside the app's logs (Software Specification §6.4). It holds `tape.jsonl` (one line per event), `shots/0001.jpg`, … (the whole view after each action), `environment.json`, the project's text files before (`project/`) and after (`project-after/`) — and the shared library's, when the project has one (`library/`) — and the log's tail (`log.jsonl`, masked, without an error's message or stack). `scripts/replay_tape.py <folder>` copies `project/` to a temp folder, launches the agent build there at the recorded size, theme and locale, walks the tape through this server's own tools (`tap`, `set_field` — for a chip, and for every keyed draft change — `set_tab`, `enter_text`, `navigate` where the app is not there already, `set_viewer` / `set_locale` / `set_theme`; a key, a drag, a scroll, a long press and an unresolved click as a manual step, printed and never failed), and at each recorded picture compares the state and the two pictures — the person's and the replay's — pixel by pixel, writing a side-by-side comparison into `<out>/compare/`.

---

### 7.13 Add a folder and a scene, move the scene

The script is folders and scenes (Project Specification §8.5, §10.1); an agent changes it through the doors a person uses — the buttons over a Contents card and a row's menu — never by writing a list. The viewer has to be the author of the list's file: the project file in use for *Script*, the folder's version for a folder.

```
set_viewer {"handle": "john123"}                           (in the bundled sample, whose project file is john123's)
navigate {"selection": {"kind": "script"}}                → the Script page; find("contents") lists the card's buttons and rows
tap {"id": "contents.add-folder"}                          → the New folder dialog, its short name already f1
tap {"id": "new-entity.name"}    enter_text {"text": "Act I"}
tap {"id": "new-entity.kind"}    tap {"label": "Act"}      (optional: a folder may have no kind)
tap {"id": "new-entity.create"}                            → the selection is fo_f1_john123_v1, on Edit; the project file lists "fo_f1" last
tap {"id": "contents.add-scene"}                           → the New scene dialog, on the folder's own page
tap {"id": "new-entity.name"}    enter_text {"text": "The harbour at dawn"}
tap {"id": "new-entity.create"}                            → the selection is sc_6_john123_v1 (the sample's scenes are 1 and 5); fo_f1_john123_v1.json lists "sc_6"
set_field {"stem": "sc_6_john123_v1", "key": "location", "text": "cafe"}
set_field {"stem": "sc_6_john123_v1", "key": "cast", "text": "main-hero\nspouse"}
navigate {"selection": {"kind": "entity", "type": "fo", "tag": "f1", "stem": "fo_f1_john123_v1"}}
tap {"id": "contents:sc_6.menu"}                           → contents.move-up, contents.move-down, contents.move-to, contents.remove
tap {"id": "contents.move-to"}                             → the move dialog: find("move.") lists move.to:script, move.to:script/fo:f1, …
tap {"id": "move.to:script"}     tap {"id": "move.confirm"} → the project file lists "sc_6" last, the folder no longer; log_tail has folder.childMoved
```

The same doors are on a row of the tree (`tap tree:<row id>` first, then `tree:<row id>.menu` and `tree.move-to`). *Remove* deletes nothing: the row is then under *Not in the script* (`find("tree:unfiled")`, the Script page's second card), whose rows offer `move-to` alone, which files them again. A refusal is an item or a button that `tap` answers `refused` / `disabled` for — a list that is somebody else's, *Move up* on a first row, *Move* before a row of the dialog is chosen — and a move whose second write failed leaves the entry in both lists, flagged, with `folder.childMoveHalfDone` in the log. **A drag is not an agent's**: every move a drag makes is one of these items.

### 7.14 Call a plug-in's function and read what it logged

The plug-in developer page (milestone 5-2) runs a plug-in's code **as it is on this computer**, with none of the question FilmOpen asks before it runs a plug-in a person installed and with every key its manifest asks for — so it is how an agent tries a plug-in it is writing, and how it reads what a call did. Everything else is the app's own: the same sandbox, doors, limits and usage records.

```
launch {"platform": "linux", "size": "1200x1600"}          (the About card is at the foot of Settings → General)
tap {"id": "nav.settings"}                                  → Settings, on General
tap {"id": "settings.plugin-dev-folder"}                    (optional: the folder of plug-ins being written)
enter_text {"text": "/home/you/filmopen-plugins"}           → applied when the box loses the focus, and the plug-ins are read again
tap {"id": "settings.plugin-dev"}                           → the page; find("plugin-dev") lists its controls
set_field {"stem": "plugin-dev", "key": "plugin", "text": "template"}       (a tag or a stem)
set_field {"stem": "plugin-dev", "key": "function", "text": "greet"}        (ask again until it is taken: see below)
                                                                            → the box fills with the function's own example
set_field {"stem": "plugin-dev", "key": "args", "text": "{\"name\": \"Kira\"}"}
set_field {"stem": "plugin-dev", "key": "mode", "text": "typed"}          (optional: the box exactly as typed; see below)
tap {"id": "plugin-dev.call"}                               → plugin-dev.cancel appears while it runs
find {"query": "plugin-dev.result"}                         → the outcome as one line: *It finished*, or a failure's place
                                                              (asked again until it is there: never wait_idle, below)
find {"query": "plugin-dev.log"}                            → plugin-dev.log:0, :1, … every ctx.log line and every door, in order
```

**Two ways of calling** (milestone 5-2b). *As FilmOpen calls it* (`plugin-dev.mode.app`, the default) sends what the app would send: `status` and an action with `ctx` alone, the box not sent; a `render` with the catalogue's entry, the inputs described, a seed and the entity the page was opened from, whose outputs are saved as takes exactly as the app saves them; a completion or an estimate as the app builds them — a request the app would never make refused before the plug-in runs; an offer with the box, as a calling plug-in would. *Exactly what I typed* (`plugin-dev.mode.typed`) sends the box as it is and saves nothing. `set_field plugin-dev mode app|typed` chooses, as the chips do.

**A call is asked for its result, and never waited on for idle.** `wait_idle` waits until the app runs no animation, and knows nothing of a call. The developer page draws none while a call runs — only *Stop* beside *Call* — so it answers *idle* at once, the call still running and `plugin-dev.result` still *Nothing yet*; and a page that turns a spinner while it works, as the render the plug-in implementer's runner watched did, never idles, so the op ends in `timeout` however well the call is going. Ask `find("plugin-dev.result")` again, or read `last-run.json`, which is written when the call ends, until the answer is there, within a bound of your own; a call has ten minutes at most.

**Choosing a plug-in reads its files from disk**, so its functions are there to choose from a moment later: `set_field … function` straight after `set_field … plugin` is answered `not_found`, and is simply asked again until it is taken — which is what the acceptance walk and `test_plans/run_mcp.py` both do.

**What a call answered** is read from `last-run.json`, not off the screen — which also says which way it was called (`mode`, `app` or `typed`) and holds the request as sent (`args`: `null` where the call was refused before anything was sent): the value is drawn as selectable text, and a value travels only under `valueIdentifiers` — the page's own two **paths** do (`plugin-dev.result-file`, `plugin-dev.log-file`), so that an agent can find the files, and the arguments box and the answer do not.

**What the page's rows say.** The first row is `request`: the request as it was sent, there before the plug-in answers. A row is `<ms> · [<tag> ·] <kind> · <what> [· <detail>] [· <ms>]`: the time since the call began; **the tag of a plug-in the code called**, where it is not the one being run; the door's name (`log` for a line the code wrote, else `http`, `call`, `storage.set`, `project.script`, `sleep`, …); what it was asked for — a request names the setting or the key it used and the **route** of an address, never its query and never a value; and how long it waited. A failure's line carries its code, its reason, the author's own message and **the file, line and column** it was thrown at, under the names the manifest's `entry` gives.

**Two files, for reading rather than looking.** `find("plugin-dev.result-file")` and `find("plugin-dev.log-file")` give their paths:

- `last-run.json` under `<app support>/plugins/<tag>/dev/` — the function, the arguments, the outcome, the log and the doors of the **last** call, as data, under a megabyte (over that it drops its lines, then its arguments and its value, saying which in `cut`).
- `plugins-dev.jsonl` beside the app's log — one line per line of **every call made from this page**, with the plug-in and the function that made it and, for a call a plug-in made, the tag it came from. Nothing of a person's ordinary use is in it, and no issue report ever carries it.

Read them off disk; neither travels through this channel. A code file changed on disk is read again by the next *Call* — no restart, and no *Allow* for every save — which is what makes the page worth an agent's while: edit, call, read the file, edit again.

---

## 8. Rules, limits and security

### 8.1 What can be written

- The bundled sample opens **read-only** unless development mode is on (then as an editable session copy, lost at exit unless `project.copy-to-folder` keeps it). Development mode is on by default in every debug build the first time, but it is a stored preference: on Windows every build shares the machine's store, so the machine's last choice holds; on Linux a `launch` without `home` starts from fresh folders, so it is on. `state.developmentMode` says.
- A folder project is written only under the viewer's handle: the viewer's own versions are editable, everybody else's are *View* (fork them, or turn development mode on). Only a director of the project file of record sets official. The shared library is never written except in development mode.
- A file changed on disk since it was read is never overwritten: the write is refused as stale and the page offers `draft.discard` / `draft.retry`.
- Nothing bypasses the app's writer: there is no tool that writes JSON.

### 8.2 Timing

| What | How long |
|---|---|
| `launch`, first build | minutes; warm, about 15 s |
| an op in the app | answered within 30 s of arriving, else `timeout`; ops run one at a time |
| a request on the link | 45 s, else `no_connection` and a reconnect on the next call |
| an acting op's settle | the frame that shows the change and its animations, up to 5 s; never a file write |
| a plug-in call | as long as the plug-in takes, ten minutes at most: ask for its result (`plugin-dev.result`, `last-run.json`) — `wait_idle` knows nothing of a call: it answers at once on the developer page, which draws no animation while a call runs, and never where a spinner turns (§7.14) |
| the autosave | about 700 ms after `set_field`; then `entity.saved` in `log_tail` |
| `screenshot` | about 2 s (the driver waits for the last frame); `page_shot` at once |
| a running recording, after each action | a settle of at most 1.5 s, twice (a pull-down's menu or a tooltip can start its animation a frame late), then a JPEG encode on another isolate |
| `stop` | usually seconds; at worst about two minutes |
| the link opening | 10 s to reach the service and find the driver extension |

### 8.3 What the answers never carry

The text typed through `set_field`; a label given to `tap`; an error's message or stack (its type travels, the log file keeps the rest); the `data` of the account's events; a text field's value outside the project's own identifiers; an e-mail address anywhere in text (masked as `<e-mail>`); a VM service URL's token in any error (an error travels as its type; a failed launch's lines are redacted). Pictures are pixels: they show what the screen shows.

### 8.4 Where the layer reaches

- The VM service listens on the loopback only; a URL anywhere else is refused. A remote agent reaches a box through SSH port forwarding, not through a LAN flag (there is none).
- The server writes files only when asked: a picture, as a new `.png` in its own working directory or over one it wrote; on Linux the launched app's XDG folders, under the temp directory (removed on `stop`) or under the `home` a call names (left as they are). It never ends a process it did not start, and on Linux it ends only the process group it made.
- Every product build — a release, an ordinary `flutter run` — has no driver, no channel, no listener; the host installed there answers nothing.
- The web build has no driver; agents use the desktop binary.

### 8.5 Known limits

- No tool scrolls; a row or a control of a lazily built list that has never been in view is absent from the semantics tree (`find` and `tap` miss it; `tap` does scroll a node that exists but is hidden).
- `page_shot` shows the whole view as the app paints it, dialogs and menus included; `screenshot` shows the same routes, but neither shows a native dialog.
- Replay (`scripts/replay_tape.py`, §7.12) does not act a key, a drag, a scroll, a long press or a change of development mode: each stays a manual step, printed and never failed, and the recorded and replayed pictures are still compared around it.
- Dialog text boxes (the label, the JSON editor, New project) take no `set_field`; `enter_text` types into the one that has the focus, and nothing tells whether one had it. In an agent build the driver emulates the keyboard's text entry, so a person at the window cannot type into its boxes — `set_field` and `enter_text` can.
- `size` is honoured to the pixel on Linux; on Windows to within a pixel and never short — the runner rounds the frame up where its size does not divide by the display's scale (`state.view` says what the page got). A `size` under 700 px of width puts the tree in its drawer (§7.10).
- Nothing has run on macOS. Linux is a headless runner, not a product platform.
- An agent build closed by hand, or killed, keeps the settings an agent gave it: only `quit` (and `stop` through it) puts them back. On Linux a `launch` without `home` uses its own XDG folders, so the person's `~/.local/share/filmopen` is never read, and a `home` a call names is left as it is.

---

## 9. The data channel and the command line

For a client that is not an MCP client: a script, another framework, a test.

### 9.1 The command line

The same executable runs one command against a running agent build and prints the answer as JSON, exiting 1 when the app refuses or cannot be reached and 64 for a command line it does not understand. Options (`--vm-service-url <url>`, `--repo <folder>`) stand anywhere before a `--`; every other word is the command's.

```
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart launch [windows|linux] [--size WxH] [--home folder]
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart launch android --device <serial>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart state
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart navigate '{"kind":"entity","type":"ch","tag":"main-hero","epoch":"30yo","stem":"ch_main-hero_30yo_john123_v2"}'
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart open-project <folder> | --sample
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-tab compare
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-field <stem> <key> <text>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart enter-text <text>              # into the box last tapped (a dialog's)
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart tap version.fork            # tap --label <label> for a control without an identifier
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart tap-at <x> <y>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart find <query>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart semantics
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart log-tail [n]
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-viewer [handle] | set-locale <code>|platform | set-theme <system|light|dark>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart page-shot [file] | screenshot [file] | wait-idle | ping
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart record-start | record-stop | record-state
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart stop | quit
```

In Windows PowerShell 5.1, escape the quotes inside a JSON argument (`'{\"kind\":\"overview\"}'`).

On Linux, `launch` gives the app XDG folders of its own and names them on stderr; the commands that follow, run from another shell, find the app with `XDG_STATE_HOME=<that folder>/state` in their environment (or `--vm-service-url`, or `--home <folder>` on the launch and the same variable after). `scripts/agent-run.sh` starts the build with the person's own folders, or under `FILMOPEN_HOME`, and the commands find it as on Windows.

### 9.2 The data channel itself

An agent build registers Flutter's driver extension (`ext.flutter.driver`) in its main isolate; the VM service URL is the one `flutter run` prints or `agent.json` holds. Any client of `package:flutter_driver` can `requestData` on it:

- the literal `ping` → `{"ok":true,"spike":"p0","channel":"filmopen_automation"}`;
- a JSON object `{"op": "<name>", …arguments}` → `{"ok": true, "result": …}` or `{"ok": false, "code": …, "detail": …}`.

The ops are the tools of §3 by their names, with the MCP tool `page_shot` being the op `screenshot` (answering `{"png": "<base64>"}`), and the tools `screenshot` (the driver's own `screenshot` command), `wait_idle` (`waitUntilNoTransientCallbacks`), `enter_text` (the driver's own `enter_text`, through the extension's emulated text input), `launch` and `stop` being the server's, not the app's. Names, arguments, codes and answers only grow; nothing is renamed.

---

## 10. Glossary

| Term | Meaning |
|---|---|
| agent build | FilmOpen started from `test_driver/agent_main.dart`: the driver extension, the data channel and the real host installed; the only build an agent can drive |
| host | `AutomationHost`, the façade inside the app that answers the ops; the no-op one in product builds, `DriverAutomationHost` in an agent build |
| identifier | the stable `Semantics(identifier:)` a control carries, what `find` lists and `tap` takes |
| stem | a filename without its extension: `<type>_<tag>[_<epoch>]_<author>_v<n>` |
| viewer | the handle the app browses and writes as; set in Settings or with `set_viewer` |
| pick | the version an author has chosen to work with at an epoch (the green check); a fork becomes the forker's pick |
| official | the version the project's directors chose (the star, an `_official.json` pointer) |
| development mode | *Warn instead of refuse*: the rules that gate a person warn in red and let them continue; the sample opens as a session copy |
| session copy | a project held in memory for the run; lost at exit unless copied to a folder |
| draft | a form's working copy of a file, written by the autosave; `OpenDrafts` settles them before a fork or a quit |
| the link | the server's connection to one app over the VM service |
| `agent.json` | the file an agent build writes into the log folder to announce its VM service URL |
| `home` | on Linux, the folder whose `share`, `state` and `cache` are a launched app's XDG directories — its preferences, library, log and `agent.json`; fresh under the temp directory unless `launch` names one |
| the drawer | the tree below 700 px of window, behind `nav.tree`; its rows and the project menu exist only while it is open |
