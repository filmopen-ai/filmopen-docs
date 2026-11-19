# FilmOpen MCP Specification

**How an agent controls FilmOpen over MCP.**

| | |
|---|---|
| **Version** | 1.12 |
| **Date** | 19 November 2026 |
| **Status** | Describes the agent tools, their answers, codes and identifiers, and the recipes for driving the application. The data channel's tools, arguments, codes and answers only grow, with three refusals made on purpose: `set_viewer` refuses a text that is not a handle (`refused` / `invalidHandle`), as Settings' box does; the first card of a scene's, a character's and a location's form is `general` (`compare.copy-section:general`), a project's `details` being the card under it; and while FilmOpen is in development English is the one language shown, so `set_locale` refuses `es` (`refused` / `languageUnavailable`). |
| **Audience** | A developer or an AI agent that wants to start, drive, read or stop FilmOpen without a desktop: a Claude Code session, a support agent, a test harness |
| **Companion documents** | the Software Specification (`docs/software/`) §4.3 and §7.1 (how the layer is built into the app), `packages/filmopen_mcp/README.md` (the server's own page), `docs/FilmOpen-Project-Specification v1.0.md` (the file format the app reads and writes) |

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
9. The command line and the data channel (for a client that is not an MCP client)
10. Glossary

---

## 1. What the layer is

FilmOpen is a Flutter application that browses and edits a film project stored as plain JSON files, versioned per author (`docs/FilmOpen-Project-Specification v1.0.md`). The agent layer lets a program drive a running FilmOpen through **named operations** instead of a mouse and a screen:

```
an MCP client (Claude Code, a script)
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
- **Answers carry what is on screen and in the log as it is; refusals carry codes.** The text an agent typed is not repeated; a label it tapped is not repeated; the log travels as the log file writes it; typed values travel only under the project's own identifiers. Pictures show what the screen shows.

---

## 2. Setting up

### 2.1 What has to be on the machine

- A checkout of the repository, with `flutter pub get` run once at its root — it resolves the whole workspace, the server included — and the stock plug-ins staged (`python3 scripts/stage_plugins.py`).
- The Flutter SDK the repository names on `PATH`; `dart` with it.
- Windows, or Linux; on a Linux box with no display, Xvfb and the GTK toolchain.

The agent build starts without any key: every service that needs a sign-in or a paid provider says it has none. Where a check needs a signed-in app or a provider's key, start the build with the person's keys through the repository's own scripts, as the repository's setup documents describe.

### 2.2 Registering the server with Claude Code

```
claude mcp add filmopen -- dart run <repository>/packages/filmopen_mcp/bin/filmopen_mcp.dart serve
claude mcp add --scope user filmopen -- dart run <repository>/packages/filmopen_mcp/bin/filmopen_mcp.dart serve   # in every folder
```

- The path is the repository the server drives: `launch` runs `flutter run` there.
- The tools appear in the next session started there, not in the session that registered them. When a session starts the server, `dart run` compiles it for a few seconds first.
- The server's name is `filmopen_mcp` (version 0.2.0); it offers 28 tools (§3) and speaks MCP over stdio.

Any other MCP client spawns the same command. There is nothing to configure: the server finds or starts the app by itself.

### 2.3 Finding the app

Every tool that talks to the app takes an optional `vmServiceUrl`. Once `launch` owns an app, the server keeps that session's process, service URL and home. Operations never discover a replacement, and an explicit foreign `vmServiceUrl` is refused with `bad_args` / `vmServiceUrl`. When the owned app ends, operations answer `no_app` / `ended`; `stop` acknowledges or ends only that owned app and keeps the ended marker (`by: ended` if it had already exited). A new `launch` is allowed after `stop`. If stopping fails, ownership is kept so `stop` can be retried.

A server that has never launched an app, and the one-shot commands, find one this way: an explicit tool URL wins; otherwise the URL named at server start (`--vm-service-url` or `VM_SERVICE_URL`), then the open link, then the agent build announced in `agent.json` while its service answers.

`agent.json` is written by every agent build a second after it starts, in `%LOCALAPPDATA%\FilmOpen\logs\` on Windows (`$XDG_STATE_HOME/filmopen/logs/`, else `~/.local/state/filmopen/logs/`, on Linux; `~/Library/Logs/FilmOpen/` on macOS):

```json
{"vmServiceUrl": "http://127.0.0.1:55065/<auth code>=/", "pid": 13636, "startedAt": "2026-09-14T10:27:22.917Z"}
```

The URL opens the app's VM service; it is valid on the loopback only and dies with the process. `quit` removes the file. A URL from anywhere else must be `http` on `127.0.0.1`, `localhost` or `::1`; anything else is `bad_args`.

On Linux an app that `launch` started has XDG folders of its own (§3.1, `home`), so its `agent.json` is at `<home>/state/filmopen/logs/agent.json`: the server that launched it knows the URL anyway, and another process — the one-shot commands in a shell — finds it with `XDG_STATE_HOME=<home>/state` in its environment, or with the URL itself.

So an agent has two ways to get an app: call `launch`, or have someone run `flutter run -d windows -t test_driver/agent_main.dart` in the repository (`scripts/agent-run.sh` on Linux) and let discovery find it.

**Android.** An app on a device writes `agent.json` inside its sandbox, where no server on this machine can read it. The command line's `launch` therefore reads the service line in `flutter run`'s output and writes the whole URL into this machine's `agent.json` (`launch.announce {path, ms}` on stderr), so a command in another shell finds it as it finds a desktop one. The URL is on the loopback, `flutter run` forwarding the port; the file counts for nothing once its service no longer answers. `stop` from such a shell still works, the app ending its own process there (§3.1).

---

## 3. The tools

All 28 tools answer either **JSON text** (one `text` content item holding a JSON value), **an image** (`image/png`), or **an error result** (`isError: true`, one text item `{"code": …, "detail": …, …}`, §5). Every tool but `launch` takes the optional `vmServiceUrl` (§2.3). Calls run **one at a time** in the order they arrive; a `launch` that builds the app holds the calls behind it.

### 3.1 Starting and stopping

Call `stop` before replacing an owned session with a new `launch`; an already-ended app is acknowledged with `by: ended`. The identity and URL rules are in §2.3. Linux XDG directories use literal `/share`, `/state` and `/cache` suffixes, independent of the host platform.

| Tool | Arguments | Answer | Notes |
|---|---|---|---|
| `launch` | `platform` (`windows`; `linux` under `xvfb-run`; `android` on a device; the machine's own by default), `device` (**android only, and required there**: the serial `adb devices` names, the emulator's being `emulator-5554`), `project` (a folder path, or `sample`; the sample by default), `theme` (`system`/`light`/`dark`), `locale` (`en`, the one language shown during development; `es` is refused as `set_locale` refuses it), `size` (`<width>x<height>`, each side 320–4096; `1280x720` by default; **refused on android**), `home` (Windows and Linux: a folder whose `share` holds private agent render data; Linux also uses `share`/`state`/`cache` as XDG directories; a named home survives `stop`, while an omitted home creates a fresh temporary folder removed on `stop`; **refused on android**) | the state (§4.1) once the app runs and has applied the options, on Windows and Linux with `instance`: `{home}`, the folder selecting private agent render data and, on Linux, the app's own XDG directories, made absolute and canonical — its identity, also on a refusal after the start. On Linux a shell's one-shot commands reach it through `XDG_STATE_HOME=<home>/state`; on Windows discovery uses the ordinary shared announcement or an explicit VM service URL | Runs `flutter run -d <platform> -t test_driver/agent_main.dart` in the repository; a first build takes minutes, a warm one about 15 s. **On Linux** it runs under `setsid dbus-run-session -- xvfb-run -a` — a session bus of its own, never the desktop's; without `dbus-run-session`, `setsid xvfb-run -a` — with the Xvfb screen of `size` and `FILMOPEN_WINDOW` for the GTK window; the Windows runner reads the same variable and adds its frame, so on both `size` is the **view's** size, what `state.view` answers. With MLT selected (`FILMOPEN_ENGINE` unset, empty or `mlt`) a Linux launch first readies the engine, `python3 scripts/native_stamp.py ready linux` — a skip when nothing changed, minutes in a fresh checkout, every line on the server's stderr; its refusal is `launch_failed` / `native`, never a fall-back to the fake engine. `FILMOPEN_AGENT_DATA` selects the private render folder beneath `home`; Windows' ordinary preferences and logs still share the machine's store, while Linux gets XDG folders of its own. **On android** the device's serial stands for the platform, `flutter run -d <serial>`; `size` and `home` are refused rather than ignored, and `state.view` reports what the device has; the server knows the app from `flutter run`'s output (§2.3). **One build at a time from one checkout:** a launch waits for another one's build — at most its own `timeout` — through `build/.filmopen-agent-launch.lock`, which it gives up at once where that launch's process has ended (on Linux) or the lock is ten minutes old; a client that goes while it waits ends it, `launch_failed` / `stopped`. Refusals: `already_launched` until `stop` has acknowledged the previous owned session; `launch_failed` (`native`, `exited` or `timeout`) with the exit code and the last 40 lines when the app never answered; `bad_args` / `size`, `home`, `device` or `platform` for a bad or missing value; a refusal after the app started carries `"launched": true`, and `stop` ends it |
| `stop` | — | `{"stopped": true, "by": "quit" \| "q" \| "kill" \| "ended"}` | Ends the app: its own `quit` first (drafts written, the session's settings put back, `agent.json` removed), then, for an app the server launched, `q` to `flutter run`, and its whole process tree after 30 s more. Usually seconds; at worst about two minutes. A draft the app cannot write refuses it — `refused` / `drafts` — and the app stays (§7.1). Only a server that has never owned a launch may ask a discovered app to end through its own `quit`; no process the server did not start is ever ended. **On android the app ends its own process** after `quit` has written the drafts and put the settings back, since Flutter's `exitApplication` does nothing there; only the agent entrypoint does this. `timeout` / `quit` when the app was asked and did not end |
| `quit` | — | `{"quitting": true}` | The app's own exit, without waiting; `stop` does this and waits. After it, any further call may be cut off by the exit. Refused, with the app left running, where a draft cannot be written (`drafts`) or the username the session started with cannot be put back or kept in the preferences (`viewer`: refused at once where the username cannot be put back; the store checked where the username changed during the session through any door, a write the store refused before tried again) |
| `ping` | — | `{"ok": true, "spike": "p0", "channel": "filmopen_automation"}` | The handshake; answered even while an op is running |
| `wait_idle` | — | `{"idle": true}` | Waits until the app runs no animation |
| `record_start` | — | `{"recording": true, "folder": …, "events": n}` | Starts the issue recorder (§7.7): a tape of every tap, text, draft, navigation, tab, route, setting and log event, a picture after each action and the project's files, in a report folder beside the app's logs. `refused` / `recording` when one runs, `busy` while one is starting or stopping, `failed` / `recorder` when it cannot start |
| `record_stop` | — | `{"recording": false, "folder": …, "events": n}` | Stops the recording and completes its folder (the project's files after, the log's tail). `refused` / `idle` when none runs, `refused` / `busy` while one is starting or stopping, `failed` / `recorder` when the folder cannot be completed |
| `record_state` | — | `{"recording": bool, "folder": …, "events": n}` | Whether a recording runs |

### 3.2 Reading the app

| Tool | Arguments | Answer |
|---|---|---|
| `state` | — | the state object (§4.1): the project, the page, the selection, the tab, the viewer, the language, the theme, development mode, the forms open for editing, the last log event, the view |
| `find` | `query` (a substring of an identifier or a label, case-insensitive) | `{"nodes": [ … ]}`: the matching semantics nodes (§4.3) without their children, in tree order. A node scrolled out of view has the flag `hidden` and no `actions`; `tap` scrolls it into view first |
| `semantics` | — | the page's whole semantics tree as data (§4.3) |
| `page_shot` | — | an image: the whole view as the app paints it from its own render tree, at the view's pixel ratio — every route, dialog and menu included — not a native dialog such as the folder picker, which Flutter never paints |
| `screenshot` | `path` (optional) | an image: the whole view as Flutter rendered it, every route and dialog included — not the native window frame nor a native dialog (the folder picker) — and what is drawn above it: a recording's flash, and the caption of what the person says while their microphone is on, which `page_shot` leaves out. Takes about two seconds. `path` also writes the PNG, only as a new `.png` inside the server's working directory or over one the server wrote; anything else is `bad_args` / `path` |
| `log_tail` | `lines` (default 50, at least 1) | `{"events": [ … ]}`: the last events of the app's own log (§4.4) |

### 3.3 Acting on the app

| Tool | Arguments | Answer | What happens |
|---|---|---|---|
| `navigate` | `selection` (§4.2) | the state after | Shows the selection as a tree click does; the page goes to the project page if Settings was open. `not_found` for an entity, epoch, stem, batch or set record the project does not hold (`detail` names it); `bad_args` / `stem` for a stem of another entity |
| `open_project` | `path` (the project root) **or** `sample: true` | the state after | Opens the folder whose root manifest identifies it, with documents in `data/`, media in `media/` and derived pictures in `thumbnails/`. A missing manifest warns but does not prevent opening. `sample: true` opens a fresh editable session copy (a new extraction where the app keeps files). A folder that cannot be opened leaves `"error": "project.openFailed"` in the state. The project on screen writes what it still has to write first; where a draft of it cannot be written, the open is refused — `refused` / `drafts`, as `quit` is — and that project stays |
| `set_viewer` | `handle` (`""` for `default`) | the state after | Settings' handle box, through its own transition: the open drafts are written first, as the username they were typed under. A text that is not a handle is `refused` / `invalidHandle` and a change an open draft could not be written before `refused` / `draftsNotSettled`; either way the username stays what it was |
| `set_locale` | `code` (`en`, or `null` for the platform's) | the state after | Settings' language. English is the one language shown while FilmOpen is in development: `es`, which the app keeps but does not show, is `refused` / `languageUnavailable`; `bad_args` / `code` for a language the app lacks |
| `set_theme` | `theme` (`system`, `light`, `dark`) | the state after | Settings' theme |
| `set_tab` | `tab` (`data`, `script`, `workflow`, `compare`, `takes`, `commentary`; on the Script page `contents`, `script` and `workflow`; on Settings `general`, `plugins`, `models`; on GPU `servers`, `share`, `remote`; on Activity `now`, `files`) | `{"tab": "<the tab open now>"}` | Taps the tab through the tab bar's own gate — on Settings the list of pages beside the page at 700 px of window and more, a tab bar to the semantics; below 700 px Settings chooses its pages with a pull-down (`settings.page`), which `set_tab` opens — or finds open — and chooses the page from by its name, and whose value `state.tab` reads. `refused` with the reason's code when the tab is blocked (§5); `intercepted` when Compare's fork question is on screen instead — answer it with `tap` on `compare.fork-yes`, `compare.fork-no` or `compare.fork-reread`; `not_found` / `tab:<id>` for a tab the page lacks (`script` and `workflow` are a scene's, a folder's and the Script page's only) |
| `set_field` | `stem`, `key`, `text` | `{"typed": true}` | Types into the field `key` of the form editing the file `stem`, through the field's own setter: the box takes the text and the draft the change, the autosave writes it about 700 ms later, and `entity.saved` appears in `log_tail`. `not_found` / `field:<stem>:<key>` when no form edits that stem (the page is *View*, not *Edit*), when no field has that key, or when the control takes no text (a pull-down, the genre picker, the epochs editor, the style picker) |
| `enter_text` | `text` | `{"typed": true}` | Types into **the box that has the focus**, as the keyboard would, replacing what it holds — for the boxes that are not a form's field: the New project dialog's, the label dialog's, the JSON editor's, Settings' handle (`set_viewer` is the simpler door). `tap` the box's identifier first (§7.3). With no box focused the text goes nowhere and the answer cannot tell: read the box back with `semantics` (a value shows under the project's identifiers), `state` or `screenshot`. `bad_args` / `text` without a text. It is the driver's own text entry, not an op of the app (§9.2) |
| `tap` | `id` (an identifier, §6) **or** `label` (a semantics label, for a control without an identifier — a dialog button) | `{"tapped": {"by": "id", "id": …}}` or `{"tapped": {"by": "label"}}` | Performs the tap the way a screen reader does, on the node a click would reach; scrolls it into view first. On a control that opens and closes rather than taps — a pull-down, whose field offers `expand` and `collapse` and no `tap` — it sends `expand` (or `collapse`), so `tap` on a pull-down's identifier opens its menu and `tap {"label": …}` chooses an item. `not_found` (the identifier, or `label`) when nothing matches; `refused` / `disabled` when the control is disabled — a click would do nothing either |
| `click` | `id` (an identifier, §6), `keys` (optional: `shift`, `control`, `meta`, each once) | `{"clicked": {"id": …, "keys": [...]}}` | A **mouse** click on the control's centre, shown first, with the named keys held through it — the click a person marks rows with (§7.6): on a tree row plain opens and marks it, `shift` marks the range from the anchor, `control` or `meta` toggles one mark; on the Script page's Contents a click marks the row and stays on the page, two plain clicks within the double-click time open it. Each packet is a mouse's, with a real timestamp, so clicks apart are never a double-click. The keys go in as the keyboard's own events and are let go once the click has been taken, after a failure too. `bad_args` / `keys` for an unknown or repeated key; `not_found` (the identifier) when the control is not on screen once shown, the reason in `agent.mouse.notFound` — a lazy row not yet built is not in the semantics tree, so `scroll` (`within: page.tree`, `direction: down`) reaches it first (§7.6); `refused` / `keyHeld` when another input already holds one of the keys, which is left held. `tap` stays the screen reader's action |
| `drag` | `from`, `to` (identifiers, §6), `place` (`upper`, `centre`, `lower`; `centre` by default) | `{"dragged": {"from": …, "to": …, "place": …}}` | A **mouse** drag: pressed on `from`'s centre, moved in eight short steps a frame apart, let go at one-sixth, one-half or five-sixths of `to`'s height. Both rows are shown first and must be on the page at once: `not_found` names a row that is not in the semantics tree (a lazy row not yet built: `scroll` (`within: page.tree`, `direction: down`) to it first), outside the window, hidden, or outside its list's visible area, the reason in `agent.mouse.notFound`. Where the list scrolls itself under the pointer and the target has moved by the release, the drag is `refused` / `targetMoved` (`agent.drag.targetMoved {dy}`) and nothing is dropped: keep both rows clear of the list's top and bottom. The app decides what the point means, as for a person's drop — on a scene the upper half is before it and the lower after, on a folder the middle third is into it, on *Script* everywhere is into it — and logs it (`tree.move.marked`, `folder.childMoved`, or the refusal's reason); the answer says the gesture was made, not that anything moved: read `log_tail` before the tree. A marked row carries every mark (§7.6) |
| `pick_files` | `paths` (absolute paths of existing files; `[]` for a cancel) | `{"queued": n}` | Holds the answer of the **next file dialog** the app opens — the upload sheet's Browse (`media.browse`) — which takes it instead of opening the native dialog, once; a second `pick_files` replaces the first (`agent.pickFiles {replaced}`). `bad_args` / `paths` for a relative or missing path (`agent.pickFiles.refused {path, reason}`). It proves the app's way from Browse to the import, not the native dialog itself |
| `scroll` | `id` (exact identifier), `direction` (`down` or `up` the page), `within` (identified region, default `page.content`; `page.tree` for the tree, `page.body` or `page.header` for an entity’s independently scrolling regions), `maxScrolls` (1–40, default 20) | `{"scrolled": {"id": …, "direction": …, "steps": n}}` | Reveals a lazy control without activating it. Existing targets, including disabled controls, are shown with zero scroll steps. Otherwise sends Flutter's `scrollUp` gesture to move down the page, or `scrollDown` to move up, through the region's one visible vertical scrollable, re-reading semantics after each action. `not_found` with the target identifier at an end, no progress or the action limit; with `within` when that region is absent. Multiple vertical scrollables give `refused` / `ambiguous_scrollable`: name a narrower region. A 20-second deadline gives `timeout` / `scroll`. The selected list never changes midway |
| `tap_at` | `x`, `y` (logical pixels) | `{"tapped": {"by": "position", …}}` | A diagnostic only: a pointer down and up at a position. Never a step of a recorded or repeatable sequence; the layout of the moment decides what it hits |

There is no `fork`, `pick`, `official`, `copy`, `save` or `label` tool: each is a tap on an identifier (§6, §7), so it goes through the same control as a click and is refused as a click would be.

`page_shot` and `screenshot` show the same routes and dialogs, but they are not the same picture: `page_shot` is the op `screenshot` (§9.2), painted from the app's own render tree at once, on the app's side of the link; `screenshot` is the driver's own capture, over the VM service, which can also write a `path` and waits about two seconds for the last frame to settle.

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
  "selection": {"kind": "entity", "type": "ch", "tag": "main-hero", "epoch": "base", "stem": "ch_main-hero_base_john123_v2"},
  "nodeId": "lib/ch/main-hero/john123_v2",
  "tab": "data",
  "viewer": "john123",
  "viewerHandle": "john123",
  "locale": null,
  "theme": "system",
  "warnInsteadOfRefuse": false,
  "developmentMode": false,
  "editing": ["ch_main-hero_base_john123_v2"],
  "lastEvent": "project.opened",
  "view": {"width": 1280.0, "height": 720.0, "devicePixelRatio": 1.0}
}
```

| Field | Meaning |
|---|---|
| `project` | `null` while nothing is open. `source` is the source's label (`Sample`, or the folder's name); `path` the folder on disk, `null` for the bundled sample and a session copy; `sessionCopy` true for a writable source without a disk root (a memory project or the sample — extracted, or the web's overlay — in either development-mode setting); `canWrite` whether the project can be written at all; `warnings` the count of the loader's warnings; `projectFile` the stem of the project file in use |
| `loading`, `error` | `loading` while a project loads; `error: "project.openFailed"` after a failed open |
| `page` | `watch` (tutorials and featured works), `project` (the browser page, where the app opens), `activity` (this device's usage and the media being added), `share` (the open film's sends and receipts), `gpu` (the servers started for renders), or `settings` |
| `selection`, `nodeId` | what the detail pane shows (§4.2), and the highlighted tree row's id |
| `tab` | the open tab — an entity page's `data` (*View* or *Edit*), `script`, `workflow`, `compare`, `takes` or `commentary`, the Script page's `contents`, `script` or `workflow`, Settings' `general` or `plugins`, the GPU page's `servers`, `share` or `remote`, or Activity's `now` or `files` — or `null` on a page without tabs (the missing-project landing, a category) |
| `viewer`, `viewerHandle` | the username the app writes as — `default` where none is chosen, never `null` — and the username Settings keeps, the same handle |
| `locale`, `theme` | the language preference as stored, `null` for the platform's — the screen is English whatever it names while FilmOpen is in development; `system`, `light` or `dark` |
| `warnInsteadOfRefuse`, `developmentMode` | the switch in Settings → Development, and whether the build has the mode at all and it is on: with it, another author's version, official without being a director and the shared library warn instead of refusing. The bundled sample opens as an editable session copy independently of this switch |
| `editing` | the stems of the forms open for editing — what `set_field` can type into |
| `lastEvent` | the name of the last log event |
| `view` | the window's size in logical pixels and its pixel ratio (1.25 on a 125 % Windows display) |

Free text in the state — the handle, the project's name, its source and path — is given as it is.

### 4.2 A selection

What `navigate` takes and `state.selection` answers. `type` is the format's entity prefix, the first segment of a filename: `pj` project, `ch` character, `of` outfit, `lo` location, `pr` prop, `st` style, `mi` misc, `dc` document, `mo` model, `pl` platform, `pg` plugin, `fo` folder, `sc` scene, `sh` shot, `cu` cue, `cm` commentary, `rd` render batch (`EntityType` in `filmopen_format`; `docs/FilmOpen-Project-Specification v1.0.md` §5.4).

| Kind | Shape | Shows |
|---|---|---|
| overview | `{"kind": "overview"}` | the selected project version; the chooser if undecided, or the diagnostics landing if no project version exists |
| script | `{"kind": "script"}` | the Script page: what the project file in use holds, in order, and what is not in the script |
| category | `{"kind": "category", "type": "ch"}` | every entity of one type |
| entity | `{"kind": "entity", "type": "sc", "tag": "5", "epoch": null, "stem": null}` — `epoch` and `stem` optional | a whole entity with epochs opens its epoch overview; otherwise the exact `stem`, or the version in use at the requested epoch |
| batch | `{"kind": "batch", "stem": "rd_8af0_maria"}` | one render batch record, or one record of a comp, an assistant session or a render queue (`cp_…`, `as_…`, `rd_…` of kind `queue`) |
| pending | `{"kind": "pending", "type": "cp"}` — `type` one of `cp` comp, `as` assistant session, `rd` render batch | the viewer's pending set of that type, as the tree's *Pending* and *Pending comp* rows open it (the pending assistant session has no row of its own: its record is also among *Chats*, a `batch`); where the viewer has none, the empty page saying what fills it. Any other `type` is `bad_args` / `type` |
| other | `{"kind": "other"}` | the files the grammar does not describe |

A `stem` is a filename without its extension, `ch_main-hero_base_john123_v2`; an `epoch` is the epoch token of the filename (`base`); a `tag` the entity's tag (`main-hero`). The project's tree rows carry the same names: `find("tree:")` lists what is on screen. A sole author has no child row; several handles have one flat row each, named by the latest retained version, or latest discarded version where none is retained. The star and check follow the author holding the official version and pick, even when the row shows a newer version; an author with only discarded versions says *Discarded*. The highlighted author row may therefore name a newer version than the exact version displayed. Choose history in that author's version pull-down, or navigate by exact stem; an exact stem supplies its epoch even when `epoch` is omitted. Plug-in and shot rows keep their own structure.

### 4.3 A semantics node

What `semantics` answers as a tree and `find` as a flat list:

```json
{
  "id": 98,
  "identifier": "tree:lib/ch/main-hero/john123_v3",
  "role": "…",
  "label": "john123 v3  from ch_main-hero_base_maria_v1",
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
- A text field's **value travels only under the project's own identifiers** (`field:`, `epochs.`, `new-project.`, `new-entity.`, `settings.handle`, `tree.filter`, `dictation.`); elsewhere the node says `valueWithheld: true` (the account popup's display name and the account dialog's boxes among them). Every other text — a label, a hint, a tooltip — is given as it is.
- `hidden` marks a node scrolled out of view; `merged` a node folded into its parent (a button's inner text). A tab's node has its text on the label's first line and "Tab n of m" on the second.

### 4.4 A log event

`log_tail` answers the app's own log, event by event, as the log file writes it:

```json
{"ts": "2026-09-14T10:27:23.489663Z", "level": "info", "event": "entity.saved", "data": {"stem": "ch_rain_now_ann_v2", "path": "/home/ann/films/rain/ch_rain_now_ann_v2.json", "official": false, "ms": 4}}
```

`ts`, `level` (`error`, `warning`, `info`, `debug`, `trace`), `event` (a dotted name), `data` (codes, stems, paths, counts — the app's structured data, each value as it is, so an agent finds a stem or a path it knows by its text), and, when an error was logged, `error` (its message), `stack` and `errorType`. The `account.*` events travel with their `data`. Events an agent will look for: `project.open` / `project.opened` / `project.refresh`, `entity.saved`, `entity.forked`, `media.imported` (an upload or a render added to its place), `official.set` / `official.cleared`, `pick.set` / `pick.abandoned`, `compare.copied` (with `keys`), `guard.overridden` (development mode let a write through), `settings.locale`, `flutter.error` and `dart.unhandled` (an exception on screen or in the app), `agent.announced`, `agent.started` (an op, its arguments whole, how long it queued) and `agent.done` (its time), `agent.refused`, `agent.timedOut`, `agent.finishedLate`, `agent.failed`, `agent.quit`, `agent.quitRefused`, `agent.openRefused`, `project.openRefused`, `agent.settingsRestored`.

---
## 5. Error codes

An error result is `{"code": …, "detail": …}`, with `"launched": true` after a `launch` whose app is running, and `exitCode` / `output` on a failed launch.

### 5.1 From the app

| Code | Meaning | `detail` |
|---|---|---|
| `bad_args` | an argument is missing or malformed; checked before anything runs | the argument: `json`, `op`, `selection`, `kind`, `type`, `tag`, `epoch`, `stem`, `tab`, `key`, `text`, `id`, `label`, `x`, `y`, `query`, `lines`, `handle`, `code`, `theme`, `path` |
| `not_found` | nothing on screen or in the project answers to the name | the identifier; `label`; `position`; `field:<stem>:<key>`; `tab:<id>`; `<type>:<tag>`, `<type>:<tag>@<epoch>`, a stem; `project` (nothing open); `root` or `semantics` (nothing to paint or read yet) |
| `refused` | the app refused, as it refuses a click | `disabled` (a disabled control); a blocked tab's reason: `compareDisabledNoHandle`, `compareDisabledOwnLatest`, `compareDisabledReadOnly`, `blocked`; `drafts` (a quit while a draft cannot be written); `viewer` (a quit while the username the session started with cannot be put back — an open draft refused the change — or the preferences failed to keep it, before anything has ended); `invalidHandle` (`set_viewer` with a text that is not a handle) and `draftsNotSettled` (`set_viewer` while an open draft cannot be written first, or typing outran five passes of writing the drafts); `languageUnavailable` (`set_locale` with a language the app keeps but does not show during development); `recording` (`record_start` while one runs) or `busy` (`record_start` or `record_stop` while one is starting or stopping); `idle` (`record_stop` while none runs) |
| `intercepted` | a question is on screen instead of what was asked (Compare's fork question) | the tab asked for |
| `not_available` | the host cannot do this: a product build's no-op host, or a host without label taps, quit or the issue recorder | the op; `record` for the three recorder ops |
| `timeout` | the op was not answered within 30 s | `queued` (it never ran, and never will) or `running` (it may still land; `log_tail` says so with `agent.finishedLate` or `agent.failed`) |
| `failed` | an unexpected failure | the error's type; `log_tail` has `agent.failed`; `recorder` for `record_start` or `record_stop` when the recording cannot start or its folder cannot be completed |
| `unknown_op` | no such operation | the name |

Every refusal is logged before it is answered, as `agent.refused {op, args, code, detail, ms}`, its arguments whole as `agent.started` logs them — a message that is not an op with no `op` and the message as it came as `args`; a timeout is logged as `agent.timedOut` too, and an unexpected failure as `agent.failed`.

### 5.2 From the server

| Code | Meaning |
|---|---|
| `no_app` | no app to talk to: nothing launched, named or announced (`detail`: `launch`), or the owned app ended (`detail`: `ended`), without adopting another app |
| `no_connection` | the link failed or a request took longer than 45 s; the link is dropped and the next call reconnects (`detail`: the error's type; `error`: its message, whole) |
| `not_agent_build` | the app at the URL is a FilmOpen without the driver extension (an ordinary run) |
| `already_launched` | the previous owned session has not been acknowledged with `stop` |
| `launch_failed` | `flutter run` ended (`exited`, with `exitCode`) or ran out of time (`timeout`) before the app answered, the client went while the launch waited for another's build (`stopped`), or the MLT readiness of a Linux launch refused (`native`, with the script's `exitCode`, none where `python3` could not start); `output` holds its last lines, as printed |
| `no_repository` | the server cannot find the repository to run `flutter run` in |
| `bad_args` | `vmServiceUrl` not `http` on the loopback or different from the owned session's URL; `platform` not `windows`, `linux` or `android`; `device` empty, given on a desktop launch or missing on an Android one, or `size` or `home` given on an Android one; `size` not `<width>x<height>` within 320–4096, or `home` empty; a `path` the server may not write; `enter_text` without `text` |
| `timeout` / `quit` | the app was asked to quit and did not end within 30 s |
| `bad_reply` | the app answered something the server could not read |
| `shutting_down` | the call was still queued when the client left; it did not run |

---
## 6. The identifiers an agent acts on

Every control an agent drives carries a stable `Semantics(identifier:)`: never localised text, never an index that shifts. `find` lists the ones on screen; `tap` acts on them; `semantics` shows them in the tree. **Tabs carry none** — a tab is opened with `set_tab` — and a native dialog (the folder picker) is out of reach.

| Family | Identifiers | Where |
|---|---|---|
| The rail | `nav.watch`, `nav.project`, `nav.activity`, `nav.share`, `nav.gpu` (with `nav.gpu.badge` while servers started from the app may still cost, its value the count; the sentence follows *GPU* in `nav.gpu`'s tooltip), `nav.settings`, `nav.help` (the ?: opens the support dialog — `support.record` starts a recording, §7.7, `support.licenses` the open-source notices, `support.close` — and, while a recording runs, is the red stop button, which off the web opens *Describe the problem*); `nav.record.mic` (while a recording runs: the person's microphone, which opens it — an agent leaves it to the person; while it listens, the caption of what is said has no semantics, so that `semantics` and `find` never meet its words — `screenshot` shows it, as the person sees it); `nav.tree` (only below 700 px of window, where the rail and, on Project, the tree are one drawer: the menu button at the upper left that opens it and, while it is open, the back arrow that closes it; a section chosen in the drawer keeps it open); `nav.profile` (beneath `nav.help`: the FilmOpen account's profile — a name and the account's state — which opens the account's popup; an agent leaves the account to the person) | the left rail — below 700 px of window in the drawer, in no semantics tree while it is closed: `tap nav.tree`, the section, then `nav.tree` again |
| The support dialog and *Describe the problem* | in *Get Support*, off the web: `support.record.voice` (*Transcribe what I say*) and `support.unsent.<stamp>` (a recording not sent: its *Send*); in *Describe the problem*, which the rail's stop opens off the web (an agent's `record_stop` opens none): `support.report.description` (with `support.report.description.dictate`, dictation's door as on any box), `support.report.said` and `support.report.send-said` (where the recording holds words said), `support.report.consent` and `support.report.consent-seen` (the consent, until *Don't show this again*), `support.report.what` (*What is sent?*), `support.report.keep` and `support.report.send` (signed in), `support.report.save` and `support.report.sign-in` (signed out), `support.report.cancel` (both: it asks *Discard this recording?* — `support.report.discard.no`, `support.report.discard.yes` — and *Yes* discards the recording, deleting its folder, its zip and its receipt). *Send* reaches the website: an agent leaves it to the person | the support dialog and the dialog at a recording's stop |
| The tree | `tree:<node id>` — `tree:project`, `tree:script`, `tree:script/fo:s1/fo:e2/sc:5` (a row of the script is its parent's id and the entry: a folder or a scene by its short name, a pinned entry by its full stem — and, since an entry is whatever a file wrote, a `%`, a `/` or a `#` in it as `%25`, `%2F`, `%23`, so that no entry spells another row's id; `tree:unfiled/…` under *Not in the script*), `tree:lib/ch`, `tree:lib/ch/main-hero`, `tree:lib/ch/main-hero/@50yo`, `tree:lib/ch/main-hero/john123_v2` (rows are path-like; `find("tree:")` lists what is built); a row of the script has a menu, `tree:<node id>.menu` — built while the row or its author child is selected, or under the pointer, so `tap` the row first — one menu being open at a time, whose items are the row's: `tree.add-folder` and `tree.add-scene` on a row that holds a list — *Script* and a folder — and `tree.move-up`, `tree.move-down`, `tree.move-to`, `tree.remove` on a row whose entry moves, a scene's four (an item the viewer may not use, or that has nowhere to go — *Move up* on a first row — is disabled, and `tap` refuses it; a row under *Not in the script* offers `tree.move-to` alone); a row is marked by `click` with its keys and moved by `drag` onto another row, the marks with it (§7.6); `tree.filter`, `tree.expand-all`, `tree.collapse-all` | the tree pane — below 700 px of window it is in the drawer beside the rail, on Project only, and in the semantics only while the drawer is open: `tap nav.tree` first; a tap on a row closes it, as `nav.tree` does |
| The project menu | `project.menu`; its items `project.new`, `project.open`, `project.copy-to-folder`, `project.reread`, `project.sample`, `project.recent:<path>` | the ⋮ menu of the tree pane (in the drawer below 700 px, on Project) |
| Delete a project | `project.recent-delete:<path>` opens the question; `delete-project.no`, `delete-project.yes` answer it | the recent project’s trash can asks once to permanently delete the named project folder and everything inside it, with no checkboxes. No leaves it alone; Yes removes the folder and recent row. The target must be a real directory, neither a link nor a filesystem root, with `filmopen-project.json` at its root. A project without the manifest still opens with a warning, but trash refuses it before closing or deleting anything. |
| A version's media places | Each place of the media card is named by the version's stem and its group — `<group>` the array's name, or `preview` for the tile a `preview` no entry names: `media:<stem>:<group>.action.<id>` (the add tile's buttons, `upload` built in, whose sheet's *Browse…* is `media.browse` and takes the answer `pick_files` holds instead of the native dialog; the add tile stands only on a place that holds no live take — once one exists its *Upload* and *Render* are each take's menu's), `media:<stem>:<group>:<n>` (the n-th entry in the file's order, live entries first and, where the archived fold shows them, the archived after; drawn picked first, then the other reviewed takes, then every take waiting to be picked inside one frame whatever its batch, then the jobs, then the archived — each keeping its number), `media:<stem>:<group>:<n>.pick` (on a version the viewer may write, the check at a render's upper left: grey on a render waiting to be picked, where `tap` picks it — `unreviewed` gone, `kept_at` written —, green on one picked, where `tap` changes nothing), `media:<stem>:<group>:<n>.archive` (at every tile's lower right there: archives the entry, or unarchives an archived one), `media:<stem>:<group>:<n>.trash` (beside it, on a render waiting to be picked: deletes it from the version without asking, its record kept), `media:<stem>:<group>:<n>.menu` (a tile's menu, on a version the viewer may write, whose items `tap {"label": …}` chooses — *Open*; *Upload* (`media:<stem>:<group>:<n>:upload`), the add tile's own sheet; where *Render* applies, *Render again* (`media:<stem>:<group>:<n>:render-again`), the place's plain render, on every take; after a divider, on a take asked at Draft, *Render at final resolution* (`media:<stem>:<group>:<n>:render-final`), the render dialog at Final on the place's Final default with the take's recorded first frame and references, made for a character's reference images, sheets and motion clips, and elsewhere refused in the dialog with why; *Favourite*, or *Unfavourite* on a favourite; *Set as preview*, on a picture only; *Move earlier* and *Move later*; *Note…*; *Delete*, but on a render waiting to be picked — the labels those of the app's language; *Move* moves a take within the group it is drawn in; an item that may not run is disabled and says why under its name: *Already the preview*, *Already at the start*, *Already at the end*, or *Upload*'s and *Render again*'s reasons), `media:<stem>:<group>.archived` (the archived fold beside the title: an archive icon and the count, its words *Archived (n)* / *Hide archived* its tooltip), `media:<stem>:<group>:job:<n>` (the place's n-th job, newest first, whose buttons are `job:<id>:<action>`) and `media:<stem>.stage` (the stage the version's renders are asked at, on the card's title row: `tap` one of `media:<stem>.stage.prototype`, `.draft`, `.final`, which writes `render_stage` through the form; on a narrow card each shows its initial, its word its label; held, its tooltip saying why, on a version the viewer may not write); in the sheet *Upload* opens, `media.browse` (a native file dialog, which no tool reaches), `media.url`, `media.import`, `media.cancel`; in the note dialog `media.note.text`, `media.note.save`, `media.note.cancel`, and in the delete dialog `media.delete.confirm`, `media.delete.cancel`; on the Takes tab `take:<take stem>` and its batch chip `take:<take stem>.batch`; in the viewer a tile opens, `player.note` (the entry's note, where it has one), `player.close`, in a place's gallery `viewer.prev` and `viewer.next` (disabled at the ends) and `viewer.take:<index>` (the strip's tiles, from 0), `player.reveal` (absent where the file is not on this machine) and, for a clip or a sound on a platform that plays one, `player.play` / `player.pause` — the same control, named for what pressing it does next — and `player.seek`, the seek bar, which `find` lists and no op moves: a slider's node carries increase and decrease and no tap, so `tap` refuses it as `disabled` | adding media to the place a person chose, what the version decides about it, and looking at it (the Project Specification §9.0). An agent uploads through the place's own door: `tap media:<stem>:<group>.action.upload` on an empty place, or `tap media:<stem>:<group>:1.menu` then `tap media:<stem>:<group>:1:upload` once a take exists, then `tap media.url`, `enter_text` the address, `tap media.import`; a place takes only its kinds, and refuses another in the sheet, so a clip goes into a clip's place — a character's *Motion clips*, always shown. The object forms' cards have no `media:<stem>.place`: a type's places are fixed; a block keeps its *Add a place…*, `media:<stem>:<block-id>.place`. A tile is found by the name the file had, which it carries as its label, and only an identifier of the tile's shape is a tile — a job's tile carries the name too while it runs. A drop has no op. A picture served from `127.0.0.1` is how a check uploads without a file dialog and without anything leaving the machine. In the **web preview** that server must send `Access-Control-Allow-Origin: *`, or the browser refuses the fetch before the application sees it; the Windows and Linux builds need no such header |
| The render dialog | `media:<stem>:<group>.action.render` opens it, beside *Upload*, on an empty place, and a take's *Render again* (`media:<stem>:<group>:<n>:render-again`) once the place holds one (each disabled, saying why, where renders do not run); in it `render.stage` (the stage this request is asked at, starting at the one the entity's media card sets: `tap render.stage.prototype`, `.draft` or `.final` changes the request's alone, never the entity's, *Render* held until the model recommended at it has landed, or, where that cannot be read (`render.stage.noRecommendation` says so), until a model or the stage is chosen again; held at Final where *Render at final resolution* opened it), `render.recommend` (one line, *Renders with: model, platform, settings*, which `find render.recommend` reads; `tap` it to show or hide the controls below, collapsed as the dialog opens unless a refusal among them opened it — an agent that needs them first looks for `render.model` and taps `render.recommend` only where it is missing), under it `render.model`, `render.route` (where the model runs in more than one place — the person's own, each server started, what bills by the call — chosen by its label with `tap {"label": …}`), `render.stack` (where the route has more than one way of running it), `render.param.<name>` (each of the route's choices, by the catalogue's parameter name), `render.prompt`, `render.negative` and `render.seed` (where the model takes them; at a picture's place of a character, a location, an outfit or a prop and at a block's frames and its clip the two prompt boxes are inside the dialog's Prompt card (a clip's at `<id>.prompts.clip`, its writer handed the later blocks the clip covers and, like every dialog card, the model chosen), `prompt:<stem>:<path>:toggle` / `:writer` / `:generate` as on the page, drawn only while the card is open — a current prompt's card is collapsed, so `tap` its toggle first — typing into the page's draft, and read-only where no page is open on the file in *Edit*; a take continued, an outfit's sheet, a voice and a line keep the box), `render.treatment` and `render.treatmentNegative` (the film's treatment, on a picture's or a clip's model where one applies; the second where the model takes a negative prompt), `render.treatmentFields` (read only, above the treatment's box: the treatment's primary leaves as the prompt names them after the entity's words, and where they come from — `find render.treatmentFields` reads what a render will be given), `render.frame` (the pictures a clip may open on, on a model that takes a first frame, or what to add) with `render.frame.<n>` (each picture, chosen by a `tap`; `selected` on the chosen one) and `render.silent` (a clip the model makes without sound), `render.images` (how many images, a box that takes `enter_text` where the route offers a count, else held at 1 for an image model and absent where nothing renders images) with `render.quote` (the price of them all, beside it), `render.finalRefusal` (why *Render at final resolution* cannot render here, *Render* held), `render.serverGone` (the server chosen is offered no more, and where the render would now run, *Render* held for the person's choice), `render.reading` (the plug-ins are being read again, which holds *Render*), `render.prompt.length.refused` (the words as sent longer than the chosen way's `inputs.prompt.max_characters`, which holds *Render* and is never cut), `render.notReady` (why the route cannot run now) with `render.settings` (*Settings*, on the tab that fixes it — also under a chosen way that is not ready, on *Plugins*), `render.submit` (*Render*), `render.cancel` and `render.queue` (*Add to batch*: held with *Render*, absent while a voice is designed; it adds the same frozen request to the viewer's pending render batch and inserts nothing, the message's `render.queue.open` opening the batch's *Pending* row; a refused add is said under the place's tiles); where a server provider is on and no server is starting, ready or costing, `render.openGpu` (*Open GPU*, under a line saying a GPU server is started in advance on the GPU page), which closes the dialog and opens that page; a pull-down is `tap`ped and its item chosen with `tap {"label": …}`, a box takes `enter_text` | asking for a render at the place it lands in (the Software Specification §9.3): the request is frozen when *Render* is pressed, and its job then runs on the place's tile as an upload's does |
| The servers' window | `gpu.start` on the GPU page opens it; in it `servers.checking` (while the provider is asked), `servers.provider` (where more than one is on), `servers.search`, `servers.offers` (the GPUs, which scroll within it: `scroll servers.offer.<n> down servers.offers`) with `servers.offer.<n>` (each GPU the search leaves, from 0), `servers.refresh`, `servers.idleMinutes`, `servers.refused` (a refusal before anything was asked), `servers.deploy` (*Deploy*) and `servers.cancel` | starting a server paid by the hour for renders (the Software Specification §9.3): the GPUs with their whole hourly price and the time of the prices, the minutes without work after which the provider stops it, and one server started, listed with its stop on the GPU page |
| Sharing | `sharing.drive`, `sharing.folder`, `sharing.folder-path`, `sharing.folder-browse`, `sharing.stop`; `sharing.sign-in`, `sharing.sign-out`, `sharing.sign-in-cancel`; `sharing.state`, `sharing.working`, `sharing.notice` | Settings → General. Folder controls depend on platform support; Stop sharing appears where the film is shared. A disabled control's tooltip says why. `sharing.state` is the state line; `sharing.working` is shown while a gesture is under way; `sharing.notice` holds the last refusal on its film. Sign-in cancellation appears while the one sign-in the card and Share share waits. Session copies and the web offer no sharing controls. |
| Activity | `activity.dismiss-done`; `usage.month`, `usage.totals`, `usage.uses`, `usage.shared`; `job:<id>:<action>` for each offered action | This device's usage first (the usage log, read again each time `nav.activity` shows the page), then the shared plug-ins' money on the account (`usage.shared`, read from the account's ledger each time too; its signed-out line while nobody is signed in), then the open film's media being added, newest first, in one scroll view. `activity.dismiss-done` dismisses the additions that are done or stopped. Rows, actions and refusals as on Share. |
| Share | `share.dismiss-done`; `share.set-up` (with a film and nothing listed: opens Settings on General, where the Sharing card is); `activity.sign-in-cancel`; `job:<id>:<action>` for each offered action | The open film's sends and receipts, newest first. Each row is a node of its own, its label its name and its sentence, so `find` answers one node per row (`find "Sent."` counts the finished sends on screen). `share.dismiss-done` dismisses done and stopped jobs and is disabled, with its reason, where there are none; a failed job is dismissed by its own `job:<id>:dismiss`. An action under way is disabled until it answers, and a `tap` on it is refused. A refused action is said under its row, as a node of its own, until the next action pressed on the row, the job moving on or leaving the list, or the film closing. A row’s Sign in asks the Sharing model’s sign-in before the action reaches the sync service; while it waits the row says so, and `activity.sign-in-cancel`, under the first waiting row — or above the request for a film where the film closed meanwhile — stops the one wait the card and Share share; failure or cancellation leaves its hold. |
| GPU | on *Servers* (`set_tab servers`, where the page opens): `gpu.comfyui` with `gpu.comfyui.open`; `gpu.start`, `gpu.sessions`, `gpu.<name>.stop`; on *Share my plugins* (`share`): `gpu.share.free.box`, `gpu.share.free.add`, `gpu.share.free.<id>.remove`, `gpu.share.public`, `gpu.share.retry`, and in the offer tree `gpu.share.offer.<id>.enabled`, `gpu.share.offer.<id>.edit`, `gpu.share.<tag>@<place>.add` (the place `local` or `<provider>:<offer>`), and in its editor `gpu.share.editor.stack`, `gpu.share.editor.param.<name>`, `gpu.share.editor.name`, `gpu.share.editor.price`, `gpu.share.editor.enabled`, `gpu.share.editor.save`, `gpu.share.editor.cancel`; *Using remote plugins* (`remote`) has none | Three tabs, opened by name and back on *Servers* whenever the page is left. *Servers*: this computer's ComfyUI first (`gpu.comfyui`: its plug-in's state — *Off*, *Enabled — open to check.*, *Checking…*, *Ready*, else the plug-in's own words — and `gpu.comfyui.open`, which opens Settings → Plugins on the plug-in's page; absent where no platform plug-in reaches one), then every server the sessions keep, with its phase, its lease, a stop owed, what it ran for and its last problem. `gpu.<name>.stop` is drawn where the server can be stopped or its stop is owed, disabled with its reason where it cannot act now; `gpu.start` opens the provider's offers (the servers' window's `servers.*` doors), disabled with its reason where no server provider is on, absent where no sessions are kept. An agent never starts a paid server unasked. *Share my plugins* shows the account's audience — own devices fixed, the free list (a name typed into `gpu.share.free.box` after a `tap` on it, then `tap gpu.share.free.add`; each id's chip removed by `gpu.share.free.<id>.remove`), the public box — always the account's answer, every control disabled while a write is under way, the failure line with `gpu.share.retry` where the read or the write was refused, and one line and none of these while nobody is signed in. |
| A media place’s job actions | `job:<id>:<action>` on the job’s tile, `media:<stem>:<group>:job:<n>`; get the concrete identifiers from `find` or `semantics`, then `tap` one | Each offered action belongs to its job, even when two jobs have the same Retry, Attach again or Dismiss label. A refusal stays inline after leaving and returning. Wait for the entry’s tile, `media:<stem>:<group>:<n>`, or the resolved job state; `wait_idle` alone does not mean an import completed. |
| New project | `new-project.folder`, `new-project.browse`, `new-project.title`, `new-project.tag`, `new-project.cancel`, `new-project.create`; dictation controls `new-project.title.dictate`, `new-project.tag.dictate` | the New project dialog; `browse` opens a native parent-folder picker, which no tool reaches. The parent row is absent on a phone. No media-location or source panel is offered, and no username box: the project is made as the username in effect, which `set_viewer` sets first. |
| The script's contents | `contents.add-folder`, `contents.add-scene`; a row `contents:<entry>`, the entry as the list writes it (`contents:fo_f1`, `contents:sc_5_maria_v1`; a second equal entry carries `#2`, and a `%`, a `#` or a `/` the entry itself writes is `%25`, `%23` or `%2F`), which opens the row's page; its menu `contents:<entry>.menu` with `contents.move-up`, `contents.move-down`, `contents.move-to` and `contents.remove` | the Script page (`{"kind": "script"}`) and a folder's page on *View/Edit*; the buttons are disabled, and `tap` refuses them, on a version that is not the viewer's |
| The Script tab | `script.mode` (one identifier over *Screenplay*, *Scene grid*, *Shot list* and *Timeline*, a scene opened by itself offering *Screenplay* and *Shot list*: `tap {"label": "Scene grid"}` chooses), `script.card.<stem>` (a scene's card in the grid, opening its scene), `script.grid.pictures` (on the grid, the *Include pictures* checkbox: `tap` ticks or unticks it), `script.timeline.<stem>` (a scene's block on the reading timeline, opening its scene), `script.timeline.colouring.board` and `script.timeline.colouring.location` (the timeline's two choices, *Characters* and *Locations*), `script.shots.<stem>.heading` (a scene's slug line in the Shot list, opening its scene), `script.shots.<stem>.shot.<n>` (its n-th planned shot's row, read-only) and `script.export` (the Export pull-down: `tap` opens it, `tap {"label": "Fountain…"}` chooses; its items `script.export.pdf`, `.fountain`, `.csv`, `.fcpxml` and `.clipboard`, a file item disabled with its reason off the desktop); on a folder or the whole film, the filters: the chips `script.filter.int`, `script.filter.ext`, `script.filter.day`, `script.filter.night`, the checkbox menus `script.filter.character`, `script.filter.location` and `script.filter.resource` (`tap` opens; a row is the menu's identifier and the tag, as `script.filter.location.<tag>`, and `tap` on it ticks or unticks, the menu staying open), `script.filter.search` (a box: `tap`, then `enter_text`) and `script.filter.clear` | the Script tab of a scene, a folder or the Script page |
| The move dialog | `move.to:<the tree's row id>` — `move.to:script`, `move.to:script/fo:s1/fo:e2`: *Script* and the folders the viewer may change, without the moved folder, what is beneath it and any other folder it holds —, `move.confirm` (refused until a row is chosen), `move.cancel` | after `tree.move-to` or `contents.move-to`; the entry goes to the end of the one chosen. Rows of the script can be dragged with a mouse or a finger, and every move a drag makes is one of these menu items — a drop *into* a folder is `move-to`, a drop between rows `move-up` / `move-down` or `move-to` and then those; an agent may make either, the drag with `drag` (§3.3, §7.6). A move between two folders writes the destination first: `log_tail` shows `folder.childMoved`, or `folder.childMoveHalfDone` where the origin could not be written and the entry is listed twice |
| A folder's form | `field:<stem>:name`, `:kind` (a pull-down: `tap` opens the menu and `tap {"label": …}` chooses, or `set_field` it with a token, or nothing to remove it), `:epoch` where the project declares an epoch (a pull-down, *Default* first: `tap` and `tap {"label": …}`, or `set_field` a declared token, or nothing to inherit again; `:epoch.clear` while it names one), `:synopsis`, `:notes` | a folder's page (`{"kind": "entity", "type": "fo", …}`) on the viewer's own version |
| A scene's form | `field:<stem>:name`, `:synopsis`, `:location` and `:epoch` (`tap` opens the menu and `tap {"label": …}` chooses, or `set_field` a short name, or nothing to remove the key — a name the project does not have writes nothing; the location's menu ends with `:location.new`, which opens the new-entity dialog and puts the location it makes in the scene — where the project has no location there is no menu, and `tap :location` opens the dialog at once; `:location.clear` and `:epoch.clear` remove the key), `:cast` (`set_field` one short name per line: the entries that stay keep their `epoch`, `outfit` and `notes`, and a name that is neither a character of the project nor in the scene already refuses the whole text), `:notes`; a character's row `cast:<stem>:<index>` with `.remove`, where the project declares more than one epoch `.epoch` (a pull-down), and where the character has two or more outfits at the entry's epoch `.outfit` (a pull-down: *Default outfit*, then each outfit by name); `cast:<stem>:add`, whose menu's items are `cast:<stem>:add.<short name>` and, last, `cast:<stem>:add.new`, which opens the new-entity dialog and puts the character it makes in the cast — where the project has no character there is no menu, and `tap cast:<stem>:add` opens the dialog at once | a scene's page (`{"kind": "entity", "type": "sc", …}`) on the viewer's own version; on another's the same identifiers are there, locked, without `.remove`, `.epoch`, `.outfit` and `add` |
| A scene's blocks (the *Edit* tab's *Dialog and actions* card) | a block `script:<stem>:<n>`, the n-th as listed (1 first) — on a scene with none, the one the card shows, local, as `script:<stem>:1` with its boxes and no `.menu` or `.handle`, which no `set_field` reaches until its first text, typed into its box (`tap` + `enter_text`), makes it a block — whose label is its condensed line — the speaker's name in capitals and the dialogue, else the action, else the direction, else *(empty block)* — and, once it is open (a `tap` on the line opens it), `script:<stem>:<n>.character` (a pull-down: `set_field` its `blocks.<id>.character`; by hand *No speaker* removes it), `.dialogue` (locked until a speaker is chosen), `.direction`, `.action`, `.duration`, then its beats, each `script:<stem>:<n>.beat.<k>` from `k` 0 in the block's order — `.position` (a pull-down, only where the block has dialogue: *Before the line*, *During the line*, *After the line*), `.description`, `.duration`, `.menu` (*Move up*, *Move down*, *Delete beat*) and `.handle` (a drag's: `drag` is for the tree's rows, §3.3; a handle's reorder is by hand, or by the menu's *Move up* and *Move down*) — and `script:<stem>:<n>.beats.add` (*Add beat*; none on the local block of an empty scene), then its subtitles, each `script:<stem>:<n>.subtitle.<k>` — `.position`, `.text`, `.duration`, `.menu` (*Move up*, *Move down*, *Delete subtitle*) and `.handle`, as a beat's — and `script:<stem>:<n>.subtitles.add` (*Add subtitle*); on every block `.menu` (its items by their labels: *Move up*, *Move down*, *Insert block after*, *Move to scene…*, *Delete block*) and `.handle` (a drag's: `drag` is for the tree's rows, §3.3; a handle's reorder is by hand, or by the menu's *Move up* and *Move down*); `script:<stem>:add`. *Move to scene…*'s dialog: a scene `script.move:<short name>`, `script.move.confirm` (*Move*, or *Fork and move* on another author's scene), `script.move.cancel`. No block id is ever an identifier's or a label's | a scene's page on the viewer's own version; on another's — or anywhere the form is locked — the blocks and their lines are there, an opened one read-only, its beats and subtitles too, without `.menu`, `.handle`, `beats.add`, `subtitles.add` and `add` |
| The timeline's pop-out | `timeline.popout` (the dock's button: opens the dock's picture in a window of its own, and closes it; disabled with its reason where the platform or the build cannot open a second window); in that window `monitor` (its page, a container), `monitor.fullscreen` (full screen and back) and `monitor.notice` (what the player last refused or failed, in the dock's words) | the timeline dock, and the pop-out window |
| The new-entity dialog: a character, a location, a folder, a scene | `category.add` opens it on the Characters and Locations pages, and `contents.add-folder` / `contents.add-scene` or a row's `tree.add-folder` / `tree.add-scene` for the script; its boxes are `new-entity.name`, `new-entity.tag` (for a folder or a scene already filled in with the next number — `f1`, `2` — and overtypable), `new-entity.kind` (a pull-down: a character's role; **a folder's kind with *None***; **a location and a scene have none**), `new-entity.epoch` (a character or a location only, and only where the project declares several epochs), `new-entity.cancel`, `new-entity.create` (refused, with the reason as its tooltip, while a box is not good) | a category page (`tree:lib/ch`, `tree:lib/lo`), the Script page, a folder's page or the tree, and the dialog each opens |
| The version row | `version.official` (the director's star), `version.pick` (the check), `version.label`, `version.fork`; the label dialog's `label.text`, `label.cancel`, `label.save` | an entity page's header |
| A discarded version | `entity.discarded` (the notice above a discarded version's tabs: the version is set aside, for nobody's use, and nothing brings it back; its check and star disabled with *This version is discarded*) | an entity page, on a discarded version |
| The file menu | `file.menu`; `file.edit-json`, `file.show-in-folder`, `file.copy-json`, `page.plugins` | the *More* menu of the form; `page.plugins` where an enabled plug-in's `transform` applies to the type, on a project that can be written |
| *Plugins…* (the dialog) | `page.plugins.<tag>.transform`, `page.plugins.cancel` (while one runs), `page.plugins.answer` (its label: the new version, or why nothing was written), `page.plugins.open` (the version it wrote), `page.plugins.close` | after `tap page.plugins`; closing the dialog while a run goes on stops it |
| *Analyze* | `media:<stem>:<group>.entry.analyze` (*Analyze* in a media entry's own menu, `media:<stem>:<group>:<n>.menu`, held with its reason in the item's subtitle); `analysis.choose.<tag>` (the analyzer, where several describe the kind); the review `analysis.review`: `.progress` while it works, `.fields` (each changed field with its whole new value and *Was:*), the proposal editable as the JSON editor's — `.mode` (*Tree* / *Text*), `.tree` (tap a value: `.value`, `.value-cancel`, `.value-apply`), `.text` (`tap` it, `enter_text` the whole text; read at the switch back and at either *Update*) —, `.failure` (why nothing is proposed or written), `.cancel` (asking first after an edit: `.discard`, `.discard-cancel`), `.update` (*Update this version*, on the viewer's own version), `.fork` (*Update a new version*, on every version); `analyze:<stem>:<group>` (the line under the place: the analysis under way, the last failure) | a media entry the kind of a plug-in that is on describes (the Software Specification §9.3): a picture or a recording into the character's fields, a picture's look into the visual treatment; nothing is written until *Update this version* (through the draft, in one change) or *Update a new version* (the viewer's new version, in one write) |
| The visual treatment | `field:<stem>:visual_style.<leaf>` for each leaf: `visual_style.preset`, the style picker — in *General* under the type of project on the project, first on the card on a folder (`tap` opens the popup; it takes no text, so `set_field` answers `not_found`); the five primary leaves — in *Other*'s *Camera* on the project, on the card on a folder — `visual_style.camera`, `.camera_mount`, `.lens`, `.depth_of_field_prompt`, `.color_grading`, each a box with suggested words (`set_field` any words; `tap <field>.suggestions` opens its list, whose words are `<field>.suggestion.<n>` from 1, and the camera's `<field>.other`) — and the detailed leaves, in *Other*'s subsections on the project (*Camera*, *Look*, *Light and composition*, *Grading*) and under *Advanced treatment* on a folder, on screen only while that is open (`form.other` on the project, which holds the five primary leaves too; `form.visual_style.advanced` on a folder; `set_field` reaches them closed as open) — `visual_style.mood`, `visual_style.look.grain` (chips: `set_field` a token, or nothing to remove it), `visual_style.palette` (one `#rrggbb` a line) — and `style.clear` (*Clear local overrides*, on a folder: its profile removed, its pictures kept; held where it sets none or may not be written) | the style in *General* and the rest in *Other* on the project, the last card of a folder's form (the Software Specification §9.3); a folder's box it leaves empty shows what it inherits as its hint and where from as its help |
| The style picker | `picker.source:<tag>`, `picker.category:<id>`, `picker.item:<id>`, `picker.item:<id>.full`; in the full view `picker.full.copy`, `picker.full.use`, `picker.full.close`; `picker.close` | the popup `field:<stem>:visual_style.preset` opens, and its full view |
| The form's fields | `field:<stem>:<key>` — the file's stem and the field's key: `field:ch_main-hero_base_john123_v2:summary` | *Edit* and *View* (locked) |
| A Prompt card | `prompt:<stem>:<path>:toggle` (its header: opens or closes it, its state in the node's `expanded`), `:writer` (the writers' pull-down: `tap` opens it, `tap {"label": …}` chooses; with no writer, a field saying so that opens nothing), `:generate` (*Generate a prompt*, held while one runs, while the writer's price is asked, or where there is no writer) — the two only where the card may be written: in *View* the card has no top row, and they answer `not_found`; `<path>` is the prompt's — `prompts.reference`, `prompts.sheet`, `prompts.voice` — or a block's `<id>.prompts.first_frame` / `.last_frame` / `.clip` (the clip's writer handed the block alone and no tokens). Its words are the dialog's boxes; no form draws a Prompt card. A character's voice prompt is no card and no field of the page: its words, notes and `audition_text` (`prompts.voice`) are typed in the render dialog on *Voice samples* while the voice is designed (`render.prompt`, `render.notes`, `render.audition`), its negative in Compare and the JSON editor alone | the render dialog's prompt at a picture's place of a character, a location, an outfit and a prop and at a block's frames and its clip, and the treatment of the project and a folder (the Software Specification §9.3) — no media place carries a Prompt card, and the Workflow tab's cards none; a current prompt's card is collapsed to one line ; the same card in request mode, around a render's own words in the render dialog (a Layout, a continued take), has `prompt:request:toggle` alone |
| The AI assistant | `assistant.dock` — from 1000 px of window the docked panel at the window's right, a container whose descendants are the panel's; narrower, the active assistant's portrait floating at the upper right, a button (its `button` flag) that slides the panel in, hidden while the drawer is open; `assistant.slideout`, the panel slid in, in no semantics tree while it is closed, and `assistant.hide`, its close button. In the panel: `assistant.picker` (the portrait, which opens `assistant.picker.<tag>`), `assistant.action.<id>` (an action's chip, a disabled one carrying its reason), `assistant.readiness` and `assistant.addKey`; at the top of the panel's options, the active assistant's notices, each with `assistant.message.dismiss:<id>` (its X), and where it carries a link, its title's `assistant.message.title:<id>` and its picture's `assistant.message.picture:<id>` where it has them (buttons that open it outside the app; the agent build's link door opens nothing and answers not opened); while any chat is held `assistant.chats`, the switcher, which opens `assistant.chats.<session>` per chat held; with no chat shown `assistant.empty`; an open chat's `assistant.chat`, `assistant.close` (its X at the upper right, which ends the chat), `assistant.message.<n>`, `assistant.input`, and in the box the one button by state — `assistant.cancel` while a turn runs, `assistant.send` with text in the box (greyed with the box empty where no conversation is offered), `assistant.conversation` with the box empty —, `assistant.finish` with `assistant.proposal`, `assistant.apply` and `assistant.discard`. Closing the slide-out ends a dictation under way and keeps the chat | every section of the rail, with or without a project |
| The project's warnings | `project.warnings`: on the project version's View/Edit page (`navigate '{"kind": "overview"}'`), the initially folded *Warnings* card counts every folder diagnostic; tap to list each on its own line, read-only too. With no project version, the diagnostics landing shows them without a fold. A valid name of any length draws none, and there is no advice row. | the project page |
| *Other* | `form.other` — the last card of a project's, a scene's, a character's and a location's *View/Edit*, closed on every entry to a version: `tap` opens or closes it; its parts — on the project *Release* (`year`, `rating`) and the treatment's *Camera*, *Look*, *Light and composition* and *Grading* first, whose fields are a form's — then *Other attributes* and *File*, read-only, are on screen only while it is open | *Edit* and *View* |
| The epochs editor | `epochs.add`; per epoch `epochs.<tag>.label`, `epochs.<tag>.year`, `epochs.<tag>.remove`; the add dialog `epochs.add-tag`, `epochs.add-label`, `epochs.add-year`, `epochs.add-cancel`, `epochs.add-confirm` | the project file's form |
| The official banner | `banner.fork` | above a form editing what official names |
| Compare | `compare.copy-all` (`<<<`), `compare.copy-section:<section id>` (`<<`; ids `general` — the first card of a project, a scene, a character and a location —, `synopsis` — a project's logline and synopsis —, `release` — a project's year and rating, from its *Other* —, `details` — a folder's first card —, `epochs`, `media`, `attributes`, `blocks`, `other`), `compare.copy-row:<field id>` (`<`; the field's key, `compare.copy-row:summary`); the same three the other way, into the right column — `compare.copy-all-right` (`>>>`), `compare.copy-section-right:<section id>` (`>>`), `compare.copy-row-right:<field id>` (`>`) — drawn only where the right column is the viewer's own version, else absent (`not_found`); the right column's save status and epochs editor under the prefix `right:`, writable or not, (`right:draft.discard`, `right:epochs.<tag>.year`); the fork question's `compare.fork-yes`, `compare.fork-no`, `compare.fork-reread` | the Compare tab |
| An assistant session's review | `session.pick-all`, `session.discard-all`, `compare.changes-only`, `session.summary.fold` (the summary's arrow, where it is longer than a line), `session.project.fold` (the *Project* heading of a chat that only declared epochs), `session.fold:<group>` (a group's arrow: a category by its type's name, `session.fold:character`, a folder of the script by its short stem, `session.fold:fo_ep1`), `session.heading.<short stem>` (a folder's heading where it is no item); per item `n`: `compare[<n>].pick-left`, `compare[<n>].pick-right` (over a fork's base), `compare[<n>].discard`, `compare[<n>].answer`, `compare[<n>].reread` (after a `stale` answer); its comparison's controls as Compare's with `compare.` read `compare[<n>].` — `compare[<n>].copy-all`, `compare[<n>].copy-section:<section id>`, `compare[<n>].copy-row:<field id>` and the `-right` three where the right column is the viewer's own —; its columns' fields and every control in them under `compare[<n>].left.` and `compare[<n>].right.` (`compare[<n>].left.field:<stem>:<key>`, `compare[<n>].left.draft.discard`, `compare[<n>].right.relationships:<stem>:0.character`, `compare[<n>].left.media:<stem>:<group>.action.upload`, `compare[<n>].left.cast:<stem>:add`), so a patch's two columns of one stem, and two items of one stem, are each their own | a session's record (`navigate` with its batch selection) |
| A set's page | per item `n` of the record `<stem>`: `set:<stem>:<n>` (the row) and `set:<stem>:<n>.remove` (its ×, only on the viewer's current pending record, and on a queue only on a row never submitted); on a render batch's queue `queue.render` (*Render*, disabled with its reason as a tooltip), `queue.finish` (*Finish the interrupted pass*), `queue.other:<stem>` (*Open* beside each of the viewer's other pending batches), `queue.item:<stem>:<n>` (an item's state line) and its actions `queue.item:<stem>:<n>.mark` (*Mark as not submitted*), `.readd` (*Add again*), `.record` (the record that holds the take), `.place` (the place the take went to) and `.job.<code>` (the job's own action) | a comp's or a render batch's record (`navigate` with its batch or pending selection); every session's record opens `SessionPage` |
| Comps | `media:<stem>:<group>.entry.comp` (*Add to comp* in a media entry's own menu, `media:<stem>:<group>:<n>.menu`, held with its reason where the comp holds the medium already, it has no file to upload or the service does not take its format) and the message's `comp.pending.open` (*Open*, the pending comp's page); on a comp's page `comp.title`, `comp.description` (boxes: `tap`, then `enter_text`, autosaved), `comp:<stem>:<n>` (an item's tile, opening the medium's viewer), `comp.visibility.public`, `comp.visibility.private`, `comp.post` (*POST*, disabled with the first reason that holds as its tooltip: a post under way, no item, a blank title, no account signed in, a project that may not be written), `comp.posting` (*Posting…* with its progress, while this app posts the comp), `comp.post.error` (why the last post did not go through), and on a posted comp `comp.open_url` (*Open in browser*, which leaves the machine: an agent leaves it to the person) and `comp.share` (*Share*, the link to the clipboard) | a comp's record (`navigate` with its batch selection, or the pending comp's) and a media place's menu |
| The autosave | `draft.retry`, `draft.discard` (*Discard my changes and re-read*, after a stale refusal), `draft.reread` (*Re-read files*, after a write that landed but whose folder could not be listed) | the save status |
| Development mode's red lines | `guard.<notice>`: `guard.noHandle` (opens Settings), `guard.sessionCopy` (*Copy to a folder…*) — the other notices carry no action | above a page's header |
| A stale pick | `pick.abandon`, `pick.keep` | the banner a pick the project overtook raises |
| The JSON editor | `json.mode` (*Tree* / *Text*), `json.tree` (tap a value: `json.value`, `json.value-cancel`, `json.value-apply`), `json.text`, `json.save`, `json.cancel`, `json.reread`, `json.discard`, `json.discard-cancel` | *Edit JSON…* |
| The back button | `page.back` (the `<` at the left of a project page's title row: back to the page left last, on its tab; disabled with its reason while there is none — `state` shows the page it lands on) | every page of a project but the chooser |
| Scroll regions | `page.content` (the active page, excluding the project tree), `page.tree` (the tree pane or its open drawer), `page.body` and `page.header` (an entity’s tab body and version header) | scopes for `scroll`; controls below them keep distinct semantics nodes |
| Settings | `settings.page` (below 700 px of window: the pull-down of pages, which `set_tab` drives), `settings.theme`, `settings.language`, `settings.microphone` (its menu's items `dictation.device:default`, `dictation.device:<id>`), `settings.handle` (with `settings.handle.ask-again`, which asks for the box's text again after a change was refused, and `settings.handle.retry`, which writes a username the preferences could not keep), `settings.verbose-logs`, `settings.export_encoder` (*Automatic* / *Software only*, on the desktop only; one identifier over both choices, whose centre is their divider: `tap {"label": "Software only"}` or `{"label": "Automatic"}` chooses), `settings.warn-instead-of-refuse` | the Settings page; use `scroll` for controls not yet built below its fold |
| Settings → Models | `settings.models.stage.prototype` and `settings.models.stage.final`, the two segments of the stage (a segmented control, not tabs: `state.tab` stays `models`); per kind of render shown — `t2i`, `i2i`, `t2v`, `i2v`, `flf2v`, `ia2v`, `flfa2v`, `ttv`, each only where a model of that kind has a route here — `settings.models.<kind>.model` (a `tap` opens its menu; `tap {"label": …}` chooses a model, or *The picker's default*, which clears it) and, where the chosen model has more than one route, `settings.models.<kind>.route`; then the assistant's text model, `assistant.textModel` | after `set_tab models`; a choice is kept at once in the preference `render.defaults` |
| Settings → General's speech service and a plug-in's page | `settings.speech-service`, the *Speech service* pull-down on General (a `tap` opens its menu, and `tap --label` with a line as the menu reads it chooses the service; `quit` puts the choice back), and `settings.speech-service.configure`, its *Configure*, which opens the selected service's provider page under Plugins; `keys.<owner>.<slot>`, always on its plug-in's page (as `keys.fo-openai.openai`, `keys.fo-xai.xai` or `keys.default-ai-assist.openrouter`), with `keys.<owner>.<slot>.key`, `.key.show`, `.save`, `.remove`, `.guide`, `.keys-page` and `.answer`; `keys.remove.cancel` and `keys.remove.confirm` in *Remove*'s dialog, `keys.replace.cancel` and `keys.replace.confirm` in *Save*'s; `keys.platforms` | the app's on `general`, where Settings opens each time; a plug-in's after `set_tab plugins` and `tap plugin:<tag>.open`, while it is on; a box's value never travels, `keys.` being outside `valueIdentifiers` |
| Dictation, on any box with a microphone | `<box>.dictate`, the one control every box carries; `<box>.dictate.caption` is a plain box's live caption, not its committed value. The recording microphone is chosen in Settings → General: `settings.microphone`, and in its menu `dictation.device:default`, `dictation.device:<id>` | a short tap toggles inline dictation; hold and Ctrl+Shift+Space are the person's alternatives, always available |
| Dictation repair | `dictation.open-keys`, on the page message or beside a dialog's microphone | labelled *Open <provider>*; a real tap follows the dialog pop guards and opens the speech service's provider page under Plugins (for a provider without its key, and for one that is not ready, `provider`); a refused guard leaves Settings untouched |
| Watch | `watch.tutorials`, `watch.featured` | two placeholders; nothing is fetched |
| Settings → Plugins | `plugins.install`, `plugins.prefer.text`, `plugins.prefer.media` (pull-downs), `plugin:<tag>` (a plug-in's card), `plugin:<tag>.enabled`, `plugin:<tag>.open`, `plugin:<tag>.replaced` (the line under a plug-in another has taken the place of, on its card and its page); in the consent dialog `plugins.consent` (what it asks for, as a node to read, in the words of the plug-in), `plugins.consent.allow`, `plugins.consent.cancel`; on a plug-in's page `plugins.back`, `plugin:<tag>.<key>` (a machine setting: a box, a switch or a pull-down), `plugin:<tag>.action.<id>`, `plugin:<tag>.action.cancel`, `plugin:<tag>.answer` (the last action's answer, a value), `plugin:<tag>.grant.<owner>:<slot>` (a checkbox) | after `set_tab plugins` on Settings; a machine setting's box takes `set_field plugin:<tag> <key> <text>` |
| A plug-in's card on a page | `field:<stem>:plugins.<tag>.<key>`, and in Compare `compare.copy-row:plugins.<tag>.<key>` and `compare.copy-section:plugin:<tag>` | on a character, a location or the project file, for each enabled plug-in whose settings name the type |
| Settings → General's About card | `settings.plugin-dev`, which opens the plug-in developer page; `settings.plugin-dev-folder`, the box holding the folder of plug-ins being written — typed, entered or left behind — with `settings.plugin-dev-folder-choose` (the folder picker, a native dialog **no tool can answer**) and `settings.plugin-dev-folder-clear`, there only once a folder is named | on a **desktop** build where plug-ins run at all, release builds included; absent on the web and on a phone. Both sit at the foot of Settings → General; `scroll` reveals them at ordinary window heights before a tap |
| The plug-in developer page | `plugin-dev.plugin` and `plugin-dev.function` (pull-downs), `plugin-dev.function-name` (the box under *Other…*, there only while that is the choice), `plugin-dev.mode` with its chips `plugin-dev.mode.app` and `plugin-dev.mode.typed` (*As FilmOpen calls it*, the default, and *Exactly what I typed*), `plugin-dev.folder-problems` (there only while a plug-in of the development folder cannot be read), `plugin-dev.args` (the JSON box), `plugin-dev.source` (there only as FilmOpen calls it: as typed, nothing is saved), `plugin-dev.call`, `plugin-dev.cancel` (there only while a call runs), `plugin-dev.result`, `plugin-dev.result-file`, `plugin-dev.log`, `plugin-dev.log:<n>` (a row), `plugin-dev.log-clear`, `plugin-dev.log-file`, `plugin-dev.close` — the two `…-file` rows name a plug-in's own files, so they are there once one is chosen and not before | opened by `settings.plugin-dev`, or by `plugin:<tag>.dev` on a plug-in's own page, which opens it on that plug-in. It takes `set_field plugin-dev <key>` for `plugin`, `function`, `args` and `mode`, `mode` being `app` or `typed`; a plug-in it does not list, or a function that plug-in does not expose, is refused rather than guessed. **`plugin-dev.args` is among `valueIdentifiers`**: what is typed there is read back by an agent and replayed by a recording, as the plug-in, the function and *Other…*'s own `plugin-dev.function-name` are; the two `…-file` paths travel to an agent and into an issue report as they are |
| The account | `nav.profile` (the rail's profile, beneath `nav.help`; its label `Username "<name>" · <state>`: `Login or Signup`, `Loading…`, or, signed in, the account's public name and its balance as a sentence — an amount only where one is known), and in its popup `account.login`, `account.name`, `account.sign-out`, `account.credit`, `account.close`; `account.send-code` in the sign-in dialog | the account's popup, which `nav.profile` opens, and the sign-in dialog — never used by an agent |

### 6.1 The fields `set_field` can type into

A field takes text only where a person types text; the key is the one its identifier ends with.

| Form | Keys that take text | Controls that take none |
|---|---|---|
| A project file (`pj_…`) | `name` (required: an empty text is an inline error, not a removal), `kind` (one of `short-film`, `film`, `mini-series`, `series`, or `""` to remove it; also a pull-down with *None*), `format.aspect` (`16:9`, `9:16`, `1:1`, `4:5`, `3:4`) and `format.resolution` (`480p`, `720p`, `1080p`, `1440p`, `4k`), each one of its list or `""` to remove it, also pull-downs with *None*, `format.subtitles.font` (`Noto Sans`, `Noto Sans Bold`, `Noto Serif`, `Noto Serif Bold`, or `""` for the default; also a pull-down with *Default (Noto Sans)*), `format.subtitles.size` (a whole number of pixels above zero, or `""` for the default, 48; anything else refused under the box and logged), `year`, `rating`, `logline`, `synopsis` | `genre` (a picker), `epochs` (the editor), `visual_style.preset` (the style picker) |
| A character (`ch_…`) | `name`, `appearance.age` (a number; a 4-digit year of birth, written `"N (YYYY)"` at the epoch's year, an inline error where the epoch has none or it is after it, the age the file held when the box gained focus put back (the file's own when an agent types); or a phrase, as typed), `summary`, `aliases` (comma-separated), `default_outfit`; every typed key of A.1 by its dotted path — `appearance.face`, `appearance.hair.color` / `.length` / `.style` / `.texture`, `appearance.eyes.color` / `.shape` / `.notes`, `appearance.skin`, `appearance.facial_hair`, `appearance.teeth`, `appearance.glasses`, `appearance.gender`, `appearance.species`, `appearance.ethnicity`, `appearance.height_cm` and `appearance.weight_kg` (a number; other text writes nothing), `appearance.build`, `appearance.posture`, `appearance.gait`, `appearance.hands`, `appearance.jewellery`, `appearance.marks` (one item per line, `\n`-separated), `appearance.notes`, `personality.summary`, `personality.traits` and `personality.mannerisms` (lines), `personality.wants` / `.needs` / `.fears` / `.speech`, `voice.description`, `voice.pitch` and `voice.pace` (chips: the token, `low`, `very-high`; an empty text removes it), `voice.timbre`, `voice.accent`, `voice.lang` (a character's prompts — `prompts.voice`, `prompts.reference`, `prompts.sheet` — are no field of the page: the render dialog's and Compare's), `creator_notes` | `kind`; `relationships` (rows of boxes: `relationships:<stem>:add`, then `tap` `relationships:<stem>:<n>.character` / `.relation` and `enter_text`; `relationships:<stem>:<n>.remove`) |
| A location (`lo_…`) | `name`, `within` (a tag of another location; one no other location has writes nothing; `""` removes it — it is also a pull-down: `tap` its identifier, then the location's name by label), `aliases` (comma-separated), `description`, `era`, `architecture`, `areas` (lines), `geography.city` / `.region` / `.country` / `.coordinates`, `access`, `time_of_day` (chips: the token, `golden-hour`), `weather`, `dressing` and `palette` (lines), `lighting.default`, `lighting.practicals` (lines), `lighting.windows`, `sound.room_tone`, `sound.ambience`, `prompts.reference.positive`, `prompts.reference.negative`, `prompts.sheet.positive`, `prompts.sheet.negative`, `creator_notes` | `kind` |
| A folder (`fo_…`) | `name`, `kind` (a pull-down: a token of the vocabulary — `season`, `installment`, `episode`, `act`, `arc`, `sequence`, `part`, `chapter` — or any other word, kept as written; `""` removes it), `epoch` (a declared token; `""` removes it, and the folder inherits again; an undeclared one writes nothing), `synopsis`, `notes` | what the folder holds: the Contents card above the form (`contents.*`), never a field; `visual_style.preset` (the style picker) |
| A scene (`sc_…`) | `name`, `synopsis`, `location` and `epoch` (a short name the project has, or `""`; also pull-downs), `cast` (one short name per line: the entries that stay keep their `epoch`, `outfit` and `notes`; a name that is neither a character of the project nor in the scene refuses the whole text), `notes`; a plug-in's `plugins.<tag>.<key>`; a block's `blocks.<id>.character` (a short name, or `""` to remove the speaker — a name the project does not have writes nothing), `blocks.<id>.dialogue` (refused, `not_found`, while the block has no speaker), `blocks.<id>.direction`, `blocks.<id>.action`, `blocks.<id>.duration_sec` (a number of seconds above zero, or `""` for *auto*; anything else is said under the box and not written), a beat's `blocks.<id>.beats.<k>.position` (`before_dialogue`, `during_dialogue`, `after_dialogue`, or `""` for none; another word is `not_found`), `.description` and `.duration_sec` (as the block's), `k` its place from 0 — `not_found` for a beat the block does not have —, a subtitle's `blocks.<id>.subtitles.<k>.position`, `.text` and `.duration_sec` as a beat's, the id being the block's in the file — `not_found` for an id the scene does not have or gives twice | a block's place in the list, a new block (`tap script:<stem>:add`), a move or a deletion (the block's menu), a new beat (`tap script:<stem>:<n>.beats.add`), a beat's move or deletion (its menu), a new subtitle (`tap script:<stem>:<n>.subtitles.add`), a subtitle's move or deletion (its menu), a character's own epoch (`cast:<stem>:<index>.epoch`, a pull-down, only where the project declares more than one epoch) |
| Every other type | none yet: the page shows every value locked (a form added later adds keys, never renames them) | — |
| The plug-in developer page (`plugin-dev`) | `plugin` (a plug-in's stem or its tag), `function` (a name that plug-in exposes, or `Other…`'s own box), `args` (the JSON a call is given), `mode` (`app`, as FilmOpen calls it, or `typed`) | *Call* and *Stop* (`plugin-dev.call`, `plugin-dev.cancel`), which are taps |

**`typed` says the field took the text, not that the file changed.** A field that holds one word out of a list — a project's `kind`, `format.aspect`, `format.resolution` and `format.subtitles.font`, a scene's `location` and `epoch`, a location's `within`, a plug-in's pull-down — writes nothing for a word its list does not have, and a scene's `cast` nothing for a text that names somebody the project does not have: never a guess. `set_field` still answers `{"typed": true}`; read the file back where it matters. A project's `kind` takes a 1.4 spelling (`franchise`) and writes the kind it means (`series`). A key whose value in the file has another shape than its box (an object where a word goes, `appearance` written as a sentence) takes the text and writes nothing: `set_field` answers `{"typed": true}` and the file is unchanged, as a person's typing into that locked box would be — read the file back, or `find` the field's helper. **Do not `tap` a chip row's `field:` identifier** to bring it into view: the tap lands on the row where a click would, which is on a chip, and chooses it; `set_field` it instead. The relationship rows are numbered as they stand on screen, where a row emptied while it is retyped keeps its place until its `.remove`: `relationships:<stem>:<n>` is the n-th row on screen, not necessarily the n-th object of the file.

A form is open for editing only on a version the viewer may write: the viewer's own (`set_viewer` first), or anybody's in development mode. `state.editing` lists the stems that have a form open; `set_field` on any other stem is `not_found`.

---
## 7. Recipes

Every recipe assumes the server is registered (§2.2). Every acting tool answers the state: read it after any step that changes something, and `log_tail` when a write should have landed.

### 7.1 Start, look, stop

1. `launch` → the state: the bundled sample, `project.canWrite: true` and `project.sessionCopy: true`. The sample always opens as an **editable session copy** — extracted to a fresh folder of its own, an in-memory overlay on the web — whose edits and uploads last until the sample is opened again; *Copy to a folder…* keeps every file.
2. `page_shot` to see the page; `find("tree:")` to see the rows on screen; `state.selection` to know what is shown.
3. `stop` → `{"stopped": true, "by": "quit"}`. Nothing is left running.

**A project on disk.** Copy one complete project folder somewhere the app may write (`assets/sample/the-cartographer/` for the bundled content), keeping `filmopen-project.json` at its root beside `data/`, `media/` and `thumbnails/`; then `open_project {"path": "<folder>"}` → `canWrite: true`, `sessionCopy: false` — or `launch {"project": "<folder>"}` in one call — and `set_viewer {"handle": "john123"}`, the author whose versions you may edit (the sample's authors are `john123` and `maria`).

**A width.** `launch {"size": "<width>x<height>"}` gives the view that size on both runners — to the pixel on Linux, to within a pixel on Windows and never short (§8.5) — and `state.view` confirms it. The breakpoints are in **window** width: at 700 the tree is still beside the page — the tightest such layout — and strictly below 700 the rail and the tree are one drawer behind `nav.tree`; from 1000 the assistant is docked at the right, below it a portrait (`assistant.dock`, a button) slides it in; a form goes to one field per row below 560 px of pane. Ask for `1200x800` and `700x800` with the tree on screen, `532x800` or `375x800` for the drawer, and read each from `page_shot`. Two launches in a row need a `stop` between them (`already_launched` otherwise).

**Ending cleanly.** `stop` sends `quit`: the app writes its open drafts, ends any open dictation, puts back the viewer, language, theme, development mode, dictation's microphone and speech service the session started with, removes `agent.json`, and exits; the server then ends `flutter run` — on Linux the whole process group it started, `Xvfb` included. `by` says what ended it. A `refused` / `drafts` means a draft could not be written (the file changed on disk): `tap draft.discard` (or `draft.retry`), then `stop` again. A `refused` / `viewer` means the username the session started with is not back in the preferences and nothing has ended: settle the draft, or make the preferences writable, then `stop` again. A client that disconnects without `stop` has the app it launched quit the same way.

### 7.2 Navigate and read a page

```
navigate {"selection": {"kind": "entity", "type": "ch", "tag": "main-hero", "epoch": "base", "stem": "ch_main-hero_base_john123_v2"}}
→ state.tab = "data", state.editing = ["ch_main-hero_base_john123_v2"]   (Edit: the viewer's own version)
find "version."   → version.official, version.pick, version.label, version.fork, each with its rect and actions
semantics         → the whole page, values under field:… included
page_shot         → the page as an image
```

`navigate` to a version another author wrote gives `state.editing = []`: the page is *View*.

### 7.3 Edit a field, a dialog's box, a setting

```
set_field {"stem": "ch_main-hero_base_john123_v2", "key": "summary", "text": "…"}   → {"typed": true}
(wait about a second)
log_tail {"lines": 5}   → … "entity.saved" {"stem": "ch_main-hero_base_john123_v2"}, then "project.published" {"gesture": "save", "kind": "rederive"}
```

A refusal after the write — the file changed on disk meanwhile — shows in the save status with `draft.retry` or `draft.discard`, or `draft.reread` where the write landed and only the folder's listing failed; `log_tail` has `entity.saveFailed`. A pull-down takes no text: `set_field` on `kind` is `not_found` — `tap` its `field:` identifier (the menu opens), then `tap {"label": "<the item's label>"}`.

**A dialog's box** is not a form field, so `set_field` does not reach it; `enter_text` does, into the box last tapped, replacing what it holds.

- **A version label:** `tap version.label` → the dialog; `tap label.text`, `enter_text {"text": "…"}`, `tap label.save`. `label.cancel` leaves it.
- **The JSON editor:** `tap file.menu`, `tap file.edit-json` → the editor, open on the tree; `tap {"label": "Text"}` in `json.mode` for the text (or `tap` a value of `json.tree`, `enter_text` it in `json.value`, `tap json.value-apply`); `tap json.text`, `enter_text` the whole new text, `tap json.save` — the editor's own guards apply (identity, duplicate keys, a stale file offers `json.reread`); `json.cancel` leaves, `json.discard` after a change.
- **A new project:**

```
tap {"id": "project.menu"}          (below 700 px of window: tap {"id": "nav.tree"} first — the menu is in the tree pane)
tap {"id": "project.new"}
tap {"id": "new-project.folder"}    enter_text {"text": "<the parent folder>"}    (or new-project.browse, a native picker no tool reaches)
tap {"id": "new-project.tag"}       enter_text {"text": "walkprobe"}
tap {"id": "new-project.title"}     enter_text {"text": "Walk Probe"}
tap {"id": "new-project.create"}    → the state names "Walk Probe", canWrite true, and its selection is the project file, pj_walkprobe_john123_v1
```

The project is made as the username in effect (`set_viewer` first) in `<parent>/walkprobe`: `filmopen-project.json`, `data/` (the project file and a first scene, `sc_1_john123_v1.json`), empty `media/` and empty `thumbnails/`. The dialog proposes a parent folder, which `new-project.folder` replaces; the short name follows the title until something is typed into `new-project.tag`. A project's kind is set on its page, `field:<stem>:kind`. `new-project.cancel` leaves without creating anything.

- **A new character or location:** `tap tree:lib/ch` (`tree:lib/lo`), `tap category.add`, then `tap new-entity.tag` / `enter_text`, `tap new-entity.name` / `enter_text`, `tap new-entity.create` → the page of `ch_sidekick_<default epoch>_john123_v1`, on Edit. `new-entity.kind` (a character's role) and `new-entity.epoch` (where the project declares several) are pull-downs; a tag the type already has keeps `new-entity.create` disabled (`disabled`).
- **A plug-in** (Settings → Plugins): `tap nav.settings`, `set_tab plugins`, `find plugin:` lists the plug-ins; `tap plugin:<tag>.enabled` turns one on — a plug-in that is not FilmOpen's opens the consent dialog, answered with `plugins.consent.allow` or `plugins.consent.cancel`; `tap plugin:<tag>.open`, then `set_field plugin:<tag> <key> <text>` for a machine setting, `tap plugin:<tag>.action.<id>` and `find plugin:<tag>.answer` for its answer (a plug-in turned on a moment ago may still be loading: a refused tap is retried). An entity setting is a form field: `set_field <stem> plugins.<tag>.<key> <text>`, a pull-down taking one of its tokens and a switch `true` or `false`.
- **A plug-in's rewrite:** on a version page, `tap file.menu`, `tap page.plugins`, `tap page.plugins.<tag>.transform`; poll `find page.plugins.answer` until its label says *Written: <stem>.* (or why not); `tap page.plugins.open` shows that version, `<viewer>.<tag>`'s. `tap page.plugins.cancel` stops a run, and nothing is written.
- **Share a film to a folder:** with a writable film and a viewer, `tap nav.settings`, `set_tab general`, `tap sharing.folder-path`, `enter_text` a separate directory, then `tap sharing.folder`; wait for `sharing.state` and the files there, since a tap alone does not prove delivery. `tap nav.share` lists the jobs and `tap share.dismiss-done` dismisses the finished ones; `tap sharing.stop` removes the sharing and leaves the target's files.
- **A dictation:** `tap <box>.dictate` starts inline at the focused selection or an unfocused box's end; `<box>.dictate.caption` shows the words while the file stays as it was. A second short tap stops and commits once; navigating away cancels without inserting. A provider that is not ready refuses the press with `provider` and offers `dictation.open-keys`.

**The settings.** `set_viewer`, `set_locale` and `set_theme` are Settings' doors and answer the state; `set_locale` takes `en` or `null` and refuses `es`; the identifiers never depend on the language. Development mode's switch (`settings.warn-instead-of-refuse`) sits below the fold on a 720 px window, where `scroll {"id": "settings.warn-instead-of-refuse", "direction": "down"}` reveals it.

### 7.4 Compare two versions and copy a row

Compare puts the viewer's latest version on the left and the version on screen on the right, and copies right to left.

```
navigate to another author's version (the right column), e.g. ch_main-hero_base_maria_v1
set_tab {"tab": "compare"}          → {"tab": "compare"}
find "compare.copy-row"             → the rows that differ, e.g. compare.copy-row:summary
tap {"id": "compare.copy-row:summary"}   → tapped; the left column's autosave writes it
log_tail                            → "compare.copied" {"stem": <the left version>, "from": <the right version>, "how": "row", "keys": ["summary"]}, then "entity.saved"
```

- `compare.copy-section:<id>` copies a card, `compare.copy-all` every copyable key; neither removes anything.
- `set_tab compare` on the viewer's own latest version is `refused` / `compareDisabledOwnLatest` (there is nothing to put on the left); on a read-only project without an own version `compareDisabledReadOnly`; `compareDisabledNoHandle` stays among the codes, though the username is `default` at least. In development mode the tab opens instead and says its reason as a red line.
- On a writable project where the viewer has no version at that epoch, `set_tab compare` is `intercepted`: the app asks whether to fork the version on screen. `tap {"id": "compare.fork-yes"}` forks and opens Compare; `compare.fork-no` returns to the file's data.

### 7.5 Fork, pick, official

All three are taps on the version row of the page on screen:

| Do | Tap | Then |
|---|---|---|
| Fork the version on screen | `version.fork` | the state names the new stem (the viewer's next version number, forked from the page's version); `log_tail` has `entity.forked` (`from`, `to`) and `pick.set`; the new version is the viewer's pick |
| Use this version (the pick) | `version.pick` | `pick.set`; on the official version it abandons the viewer's pick (`pick.abandoned`) and follows the star; on the version already in use it only says why (a message, nothing written) |
| Make it official / clear official | `version.official` | `official.set` or `official.cleared`; directors only (`refused` / `disabled` for anyone else, unless development mode lets it through with `guard.overridden`) |

`refused` / `disabled` is what a person sees as a greyed control: a read-only project, the library, or not a director.

### 7.6 Change the script: a folder, a scene, a move

The script is folders and scenes (Project Specification §8.5, §10.1); an agent changes it through the doors a person uses — the buttons over a Contents card and a row's menu — never by writing a list. The viewer has to be the author of the list's file: the project file in use for *Script*, the folder's version for a folder.

```
set_viewer {"handle": "john123"}                           (in the bundled sample, whose project file is john123's)
navigate {"selection": {"kind": "script"}}                → the Script page; find("contents") lists the card's buttons and rows
tap {"id": "contents.add-folder"}                          → the New folder dialog, its short name already f1
tap {"id": "new-entity.name"}    enter_text {"text": "Act I"}
tap {"id": "new-entity.create"}                            → the selection is fo_f1_john123_v1, on Edit; the project file lists "fo_f1" last
tap {"id": "contents.add-scene"}                           → the New scene dialog, on the folder's own page
tap {"id": "new-entity.name"}    enter_text {"text": "The harbour at dawn"}
tap {"id": "new-entity.create"}                            → the selection is sc_6_john123_v1; fo_f1_john123_v1.json lists "sc_6"
set_field {"stem": "sc_6_john123_v1", "key": "location", "text": "cafe"}
set_field {"stem": "sc_6_john123_v1", "key": "cast", "text": "main-hero\nspouse"}
navigate {"selection": {"kind": "entity", "type": "fo", "tag": "f1", "stem": "fo_f1_john123_v1"}}
tap {"id": "contents:sc_6.menu"}                           → contents.move-up, contents.move-down, contents.move-to, contents.remove
tap {"id": "contents.move-to"}                             → the move dialog: find("move.") lists move.to:script, move.to:script/fo:f1, …
tap {"id": "move.to:script"}     tap {"id": "move.confirm"} → the project file lists "sc_6" last, the folder no longer; log_tail has folder.childMoved
```

The same doors are on a row of the tree (`tap tree:<row id>` first, then `tree:<row id>.menu` and `tree.move-to`). *Remove* deletes nothing: the row is then under *Not in the script* (`find("tree:unfiled")`), whose rows offer `move-to` alone. A refusal is an item or a button that `tap` answers `refused` / `disabled` for, and a move whose second write failed leaves the entry in both lists, with `folder.childMoveHalfDone` in the log; a folder or a scene added logs `folder.childAdded`, a *Remove* `folder.childRemoved`.

**A bulk move**, as a person marks and drags (§3.3): after the recipe above, `sc_6` and `fo_f1` are on *Script*; add three more scenes there with `contents.add-scene` on the Script page (`sc_7`, `sc_8`, `sc_9`); then, with the rows on screen (`tap tree.expand-all`; `scroll` with `within: page.tree` to a row the tree has not built yet), a plain `click` sets the anchor, `click` with `shift` marks the range, `click` with `control` adds one more; then `drag` one of the marked rows onto a folder at `centre`. One write per list, one `project.published` for the drop, and `tree.move.marked {entries, byOrigin, to}` and `folder.childrenMoved` in the log; a drop onto a marked row is refused (`targetMarked`), so keep the destination out of the range.

```
click {"id": "tree:script/sc:6"}
click {"id": "tree:script/sc:8", "keys": ["shift"]}         → sc:6, sc:7, sc:8 marked
click {"id": "tree:script/sc:9", "keys": ["control"]}       → sc:9 added
drag {"from": "tree:script/sc:7", "to": "tree:script/fo:f1"} → the folder lists sc_6, sc_7, sc_8, sc_9 last
```

### 7.7 Record and replay an issue

The issue recorder (Software Specification §6.8) turns what a person does into a tape a support agent can replay through this same control:

```
record_start                        → {"recording": true, "folder": …}
… the person reproduces the problem …
record_stop                         → {"recording": false, "folder": …, "events": n}
python scripts/replay_tape.py <folder>
```

`record_state` answers whether one runs without changing anything. The folder is `<reports folder>/<YYMMDDHHMMSS>/`, beside the app's logs (Software Specification §6.4), and holds `tape.jsonl` (one line per event), `shots/0001.jpg`, … (the whole view after each action), `environment.json`, the project's text files before (`project/`) and after (`project-after/`) — and the shared library's, when the project has one (`library/`) — and the log's tail (`log.jsonl`). `scripts/replay_tape.py <folder>` copies `project/` to a temp folder, launches the agent build there at the recorded size and theme, in English, walks the tape through this server's tools (`tap`, `set_field`, `set_tab`, `enter_text`, `navigate`, `set_viewer` / `set_locale` / `set_theme`), and at each recorded picture compares the state and the two pictures pixel by pixel, writing a side-by-side comparison into `<out>/compare/`. A key, a drag, a scroll, a long press and an unresolved click stay manual steps, printed and never failed.

### 7.8 Call a plug-in's function and read what it logged

The plug-in developer page runs a plug-in's code **as it is on this computer**, without the question FilmOpen asks before it runs a plug-in a person installed — so it is how an agent tries a plug-in it is writing, and reads what a call did. Everything else is the app's own: the same sandbox, doors, limits and usage records.

```
launch {"platform": "linux", "size": "1200x800"}
tap {"id": "nav.settings"}                                  → Settings, on General
scroll {"id": "settings.plugin-dev-folder", "direction": "down"}
tap {"id": "settings.plugin-dev-folder"}                    (optional: the folder of plug-ins being written)
enter_text {"text": "/home/you/filmopen-plugins"}           → applied when the box loses the focus, and the plug-ins are read again
tap {"id": "settings.plugin-dev"}                           → the page; find("plugin-dev") lists its controls
set_field {"stem": "plugin-dev", "key": "plugin", "text": "template"}       (a tag or a stem)
set_field {"stem": "plugin-dev", "key": "function", "text": "greet"}        (ask again until it is taken)
set_field {"stem": "plugin-dev", "key": "args", "text": "{\"name\": \"Kira\"}"}
set_field {"stem": "plugin-dev", "key": "mode", "text": "typed"}          (optional)
tap {"id": "plugin-dev.call"}                               → plugin-dev.cancel appears while it runs
find {"query": "plugin-dev.result"}                         → the outcome as one line, asked again until it is there
find {"query": "plugin-dev.log"}                            → plugin-dev.log:0, :1, … every ctx.log line and every door, in order
```

- **Two ways of calling.** *As FilmOpen calls it* (`plugin-dev.mode.app`, the default) sends what the app would send — a request the app would never make refused before the plug-in runs — and saves a `render`'s outputs as takes; *Exactly what I typed* (`plugin-dev.mode.typed`) sends the box as it is and saves nothing.
- **Choosing a plug-in reads its files from disk**, so `set_field … function` straight after `set_field … plugin` is answered `not_found`: ask again until it is taken.
- **Ask for the result; never wait for idle.** `wait_idle` knows nothing of a call: the page draws no animation while one runs, so it answers at once. Ask `find("plugin-dev.result")` again, within a bound of your own; a call has ten minutes at most.
- **A row of the log** is `<ms> · [<tag> ·] <kind> · <what> [· <detail>] [· <ms>]`: the time since the call began, the tag of a plug-in the code called where it is not the one being run, the door (`log` for a line the code wrote, else `http`, `call`, `storage.set`, `project.script`, `sleep`, …), what it was asked for, and how long it waited. The first row is `request`, the request as sent. A failure's line carries its code, its reason, the author's message and the file, line and column it was thrown at.
- **Two files, for reading rather than looking:** `find("plugin-dev.result-file")` and `find("plugin-dev.log-file")` give the paths of `last-run.json` under `<app support>/plugins/<tag>/dev/` — the last call's function, arguments (`args`), `mode`, outcome, log and doors, under a megabyte (over that it drops parts, saying which in `cut`) — and `plugins-dev.jsonl` beside the app's log, one line per line of every call made from the page. Read them off disk; neither travels through this channel. A code file changed on disk is read again by the next *Call*.

---

## 8. Rules, limits and security

### 8.1 What can be written

- The bundled sample opens as an **editable session copy** on every platform, whatever development mode says; its edits and uploads are lost when the sample is opened again unless `project.copy-to-folder` keeps the complete project. Development mode controls the person-gating rules below; `state.developmentMode` reports it.
- A folder project is written only under the viewer's handle: the viewer's own versions are editable, everybody else's are *View* (fork them, or turn development mode on). Only a director of the project file of record sets official. The shared library is never written except in development mode.
- A file changed on disk since it was read is never overwritten: the write is refused as stale and the page offers `draft.discard` / `draft.retry`; a write that landed but could not be published offers `draft.reread`.
- Nothing bypasses the app's writer: there is no tool that writes JSON.

### 8.2 Timing

| What | How long |
|---|---|
| `launch`, first build | minutes; warm, about 15 s |
| an op in the app | answered within 30 s of arriving, else `timeout`; ops run one at a time |
| a request on the link | 45 s, else `no_connection` and a reconnect on the next call |
| an acting op's settle | the frame that shows the change and its animations, up to 5 s, or once no semantics update has been sent for 200 ms while an animation runs on (`set_theme` excepted: its colours fade on with the tree unchanged); never a file write |
| a plug-in call | ten minutes at most: ask for its result (`plugin-dev.result`, `last-run.json`), never `wait_idle` (§7.8) |
| the autosave | about 700 ms after `set_field`; then `entity.saved` in `log_tail` |
| `screenshot` | about 2 s (the driver waits for the last frame); `page_shot` at once |
| a running recording, after each action | a settle of at most 1.5 s, twice, then a JPEG encode on another isolate |
| `stop` | usually seconds; at worst about two minutes |
| the link opening | 10 s to reach the service and find the driver extension |

### 8.3 What the answers never carry

The text typed through `set_field`; a label given to `tap`; a text field's value outside the project's own identifiers. A VM service URL is not among these: an error, a failed launch's lines and the command line's `launch` console (§9.1) carry it whole, as `agent.json` does. Pictures are pixels: they show what the screen shows.

### 8.4 Where the layer reaches

- An owned session never adopts another app, through discovery or a foreign explicit URL, even after exit or stop (§2.3). The announcement's PID is informational.
- The VM service listens on the loopback only; a URL anywhere else is refused. A remote agent reaches a box through SSH port forwarding, not through a LAN flag (there is none).
- The server writes files only when asked: a picture, as a new `.png` in its own working directory or over one it wrote; on Linux the launched app's XDG folders, under the temp directory (removed on `stop`) or under the `home` a call names (left as they are). It never ends a process it did not start, and on Linux it ends only the process group it made.
- Every product build — a release, an ordinary `flutter run` — has no driver, no channel, no listener; the host installed there answers nothing. The web build has no driver; agents use the desktop binary.
- **The relay's registry is another door, not this layer.** The app's own commands — `builtin.navigate`, `builtin.export`, and the assistant's write path, `builtin.update-entity`, `builtin.create-entity`, `builtin.move-entity`, `builtin.declare-epoch` and `builtin.add-media` (followed with `builtin.job-status`) — are the registry the relay publishes behind *Remote control* and the in-app assistant calls, which writes the person's own files — their `ai:` draft, a version of their own — (the Software Specification §7.3). This development driver never reaches that registry, and none of its tools is one of them.

### 8.5 Known limits

- `scroll` reveals lazy controls through vertical semantics actions in an identified region. Horizontal scrolling and drags by position have no op; `drag` goes from one identified row to another, both on screen at once. `find` is a snapshot of built nodes; `tap` requires a built node.
- Neither `page_shot` nor `screenshot` shows a native dialog; `screenshot` also shows what is drawn above the view — a recording's flash, and the caption of what the person says — which `page_shot` leaves out.
- Dialog text boxes take no `set_field`; `enter_text` types into the one that has the focus, and nothing tells whether one had it. In an agent build the driver emulates the keyboard's text entry, so a person at the window cannot type into its boxes.
- `size` is honoured to the pixel on Linux; on Windows to within a pixel and never short — the runner rounds the frame up where its size does not divide by the display's scale (`state.view` says what the page got).
- Nothing has run on macOS.
- An agent build closed by hand, or killed, keeps the settings an agent gave it: only `quit` (and `stop` through it) puts them back. On Linux a `launch` without `home` uses its own XDG folders, so the person's `~/.local/share/filmopen` is never read, and a `home` a call names is left as it is.

---

## 9. The command line and the data channel

For a client that is not an MCP client: a script, another framework, a test.

### 9.1 The command line

The same executable runs one command against a running agent build and prints the answer as JSON, exiting 1 when the app refuses or cannot be reached and 64 for a command line it does not understand. Options (`--vm-service-url <url>`, `--repo <folder>`) stand anywhere before a `--`; every other word is the command's.

```
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart launch [windows|linux] [--size WxH] [--home folder]
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart launch android --device <serial>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart state
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart navigate '{"kind":"entity","type":"ch","tag":"main-hero","epoch":"base","stem":"ch_main-hero_base_john123_v2"}'
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart open-project <folder> | --sample
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-tab compare
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-field <stem> <key> <text>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart enter-text <text>              # into the box last tapped (a dialog's)
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart tap version.fork            # tap --label <label> for a control without an identifier
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart scroll <identifier> <down|up> [within] [maxScrolls]
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart click <identifier> [--keys shift,control,meta]   # a mouse click with those keys held
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart drag <from> <to> [--place upper|centre|lower]   # a mouse drag between two rows
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart pick-files <path>...         # the next file dialog's answer; none is a cancel
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart tap-at <x> <y>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart find <query>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart semantics
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart log-tail [n]
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart set-viewer [handle] | set-locale <code>|platform | set-theme <system|light|dark>
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart page-shot [file] | screenshot [file] | wait-idle | ping
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart record-start | record-stop | record-state
dart run packages/filmopen_mcp/bin/filmopen_mcp.dart stop | quit
```

`launch` relays `flutter run`'s output line by line, on the stream it came on, as it was printed (§8.3), and hands on the person's keystrokes one at a time where it runs in a terminal, so `q` quits — and Ctrl-C ends the launch as `q` does (`launch.interrupted`), the terminal put back —; it ends with `flutter run`'s exit code (after a Ctrl-C on Linux, the signal's: `-2` in `launch.ended`). `launch android` announces the app in this machine's `agent.json` (§2.3). In Windows PowerShell 5.1, escape the quotes inside a JSON argument (`'{\"kind\":\"overview\"}'`).

**Each launched app is private.** On Linux, `launch` gives the app XDG folders of its own and names them on stderr; the commands that follow, run from another shell, find the app with `XDG_STATE_HOME=<that folder>/state` (or `--vm-service-url`, or `--home <folder>` on the launch and the same variable after). `scripts/agent-run.sh` starts the build under a new temporary `FILMOPEN_HOME` of its own, or under the `FILMOPEN_HOME` given, and names it on its first line; `--real-home` runs it in the person's own folders. On Windows each launched app runs in the app's sandbox under its home, made in the repository's `build/sandbox-home/`, and a one-shot command finds it with `FILMOPEN_SYNOPSIS_HOME=<home>`. An agent build whose folders (on Linux `XDG_STATE_HOME` or `XDG_DATA_HOME`) are unnamed or the person's own refuses to start (`homeNotPrivate`) unless `FILMOPEN_AGENT_REAL_HOME` is `1`, which `--real-home` sets. The launcher writes `launch.home {platform, home, owned, sandbox, realHome}` on stderr, and the build logs `agent.home` once its log is open: `{platform, state, data, isolatedHome, reason: private | realHome | sandbox | shared, logFile, account, drive: withheld}`, `account` being `withheld` unless the build was started with the person's keys (§2.1). On Linux two instances run at once, each driven by the commands that name its home, and a command that names no home reaches none of them; on Windows a second launch hands itself to the first.

**The person's accounts are left alone.** Unless it is started with the person's keys (§2.1), an agent build never opens the person's filmopen.ai account and restores no session; it never reaches Google Drive: every Drive door answers not available (`drive.withheld`). `FILMOPEN_AGENT_STANDINS` (a JSON file of origins to base URLs on the loopback) routes the plug-ins' traffic to stand-ins on the machine and refuses the rest; a build whose variable cannot be read ends at once, `launch_failed` (`exited`) with `agent build refused: <code>` among its last lines.

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
| development mode | *Warn instead of refuse*: the rules that gate a person warn in red and let them continue; independent of the sample's session-copy behavior |
| session copy | a writable project without a disk root — the sample extracted to a folder of its own, or held in memory or over bundled assets on the web — for the run; edits and uploads are lost when it is discarded unless copied to a folder |
| draft | a form's working copy of a file, written by the autosave; `OpenDrafts` settles them before a fork or a quit |
| the link | the server's connection to one app over the VM service |
| `agent.json` | the file an agent build writes into the log folder to announce its VM service URL |
| `home` | on Windows and Linux, the folder whose `share` holds a launched app's private render data; Linux also uses its `share`, `state` and `cache` as XDG directories for preferences, library, log and `agent.json`, and Windows the folder itself as the app's sandbox home (its `logs` holding the log and `agent.json`), unless `FILMOPEN_AGENT_REAL_HOME` is `1`. A named home survives; an owned home is removed on stop |
| the drawer | the rail and, on Project, the tree below 700 px of window, behind `nav.tree`; its sections, its rows and the project menu exist only while it is open |
