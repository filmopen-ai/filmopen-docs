# Known limitations, and points to address

## 14. Known limitations

- **Forms exist for the project file, characters and locations.** Every other type is edited through the JSON editor until it has a form of its own. On a character or a location `refs` and `preview` belong to the **reference card** (§9.3) and have left *Other attributes*; the media keys it does not own (`picks`, `voice.providerBindings`) are read-only there, and a value of another shape than its box’s is changed through the JSON editor.
- **§13.3's block table is only half drawn.** The format asks a reader to collapse unchanged blocks (*6 unchanged*), to mark the changed words of a block both versions have, and to leave a gap where the other version has a line this one does not. A comparison here draws **every** block as its own row, marks nothing inside the text, and says *Not in this version* rather than leaving a gap. What the table says copy-left **does** in each of the four cases is implemented exactly; only the rendering is outstanding, and comes with the script editor.
- **No per-attribute compare of two epochs of one entity** (§13.3) yet: Compare's left column is the viewer's latest **at the epoch on screen**, so nothing compares across epochs. Copy-left itself is built (§9.3).
- **Copy-left does not move what two versions disagree about the shape of** — a key one holds as an object and the other as a list or a sentence — nor an empty value of any kind, since an empty value is how this application removes a key. The JSON editor is the way through either.
- **A save re-reads the whole folder.** Fine for hundreds of files; a project of thousands would want an incremental index.
- **Concurrent edits are refused, not merged.** A file changed since it was read is never overwritten (`StaleFileException`); the user re-reads and repeats the change. Two people editing the same file at once still need Git.
- **Toggling the star off deletes the pointer.** The previous official choice is not remembered; setting it again is one click on that version. A pick that tracked official then falls back (own version, else the sole author), as §6.1 says. Dragging an epoch to the top makes it the default without confirmation.
- **Except for a file an official pointer names, which resolves through official whoever is reading (§5.4), the viewer is the referencing author.** §6.1 resolves from the point of view of the file that holds the reference; the application resolves everything from the viewer's point of view, picks included. The two agree whenever the viewer browses their own work.
- **The account does nothing yet** beyond signing in and a display name: no project is synced, no key is fetched. Browser sign-in works on Windows (the scheme is registered on first use) and on the web; on macOS and Linux only the e-mailed code works until those builds exist. The OAuth round trip has been verified by reading the plugins' sources, not by a live sign-in from this checkout.
- **Google Drive is resolved** (§6.10), and a build with a Google OAuth client can keep a film’s media there. **Every other locator** (Dropbox, OneDrive, iCloud, URL) is recognised and reported, not resolved: the project opens and its media is shown as unavailable, with the locator’s type named.
- **Mobile "show in folder"** (iOS `shareddocuments://`, Android `content://`) has not run for a shared-storage path: Android is configured but the app's own files are app-private and the Android branch answers false for them; iOS is not configured.
- **The shared library is not updated by the app**: it is seeded once and then left alone.
- **The model catalogue is read only in part.** `pubspec.yaml` bundles `assets/models/` and `assets/models/platforms/` whole (the Project Specification §14.6–§14.9): Provider keys reads the platforms (§6.7), and dictation the entries of its two speech services, `stt-gpt-live-transcribe.json` and `stt-grok-transcribe-20.json`, with their platforms' files (§9.6). No other entry is read yet, and a model (`mo`) or platform (`pl`) library entry is still written by hand.
- **Warnings are not grouped**; the manifest warnings join the same list.
- **Resolution through official for official files** (§6.1 second paragraph) is implemented in the model and applied where a version's own references are rendered — today only the Script tab's speakers. Everywhere else, including the tree and the pages, the reader keeps browsing in their own world.
- **Fountain, SRT, OTIO, timeline export** and every §15–16 concern are out of scope so far.
- **Media**: a picture is shown, and a clip or a sound **plays on Windows** (§9.3, through the operating system’s own Media Foundation). The web and Linux have no player yet and say so, offering *Show in folder* where the file is on disk. A clip’s thumbnail is the kind’s stock picture, not its first frame.
- **Narrow layouts** are supported down to about 320 px of window (§9.1): below that a comparison scrolls sideways rather than fitting. The web build is a preview, not a target. the app runs on Android — the Galaxy S24 Ultra at 411 × 891 dp and the emulator at 448 × 997 — where the tree is a drawer and the system's back — the browser's Back in the web preview too — closes it (`BrowserPage`); the widths are verified in tests (360, 375 and 411 among them), in the browser preview and on the emulator.
- **Spanish** is a first translation, not yet reviewed by a native speaker.
- **Windows path length limits** are not checked before writing a new project folder.
- **Warnings are per load** and are not persisted or grouped.
- **A development-mode edit of a library file is permanent.** The shared library is read by every project on the machine and seeded only when empty; nothing restores the bundled copy.
- **A re-read during a change of library folder** may bring the old library back until the next open; **two forks of one version at the same moment** tell the second person the file changed underneath.
- **A draft whose form has gone can still be refused, and only the log says so.** A form left during a write writes what was typed meanwhile after that write; when the re-read of that write was overtaken by another, or when the write failed and its one retry is refused, the later typing is refused as stale with no save status left to show it.
- **A session copy is lost when it is left.** Choosing the sample again, or closing the app, drops a session copy's edits; there is no exit guard (disposition). The tree header says *session copy — not saved to disk*, and *Copy to a folder…* keeps it.
- **Copy to a folder copies text, not media.** A session copy keeps the JSON (and other text) of the project; the takes the sample reads from the bundle stay behind, and the copy's manifest then names a media root that is not there, which the reader reports.
- **The agent layer controls the app on Windows and on a headless Linux runner** (§4.3, §7.1).
 - An MCP client drives an agent build through the server's tools; this is proved on Windows and on Linux under Xvfb. Linux is a runner, not a product platform promised to users.
 - `launch` takes `size` (`<width>x<height>`, 1280×720 when omitted) and, on Linux, `home` (fresh XDG folders otherwise).
 - Every product build runs the no-op host.
 - No op scrolls, so a node of a lazily built list that has never been in view cannot be found.
 - `page_shot` shows the whole view as the app paints it from its own render tree — every route, dialog and menu — and `screenshot` does too, though neither shows the native window frame or a native dialog such as the folder picker. A picture shows what the screen shows, an e-mail address included. An agent build closed by hand or killed keeps the settings an agent gave it; only `quit` puts them back. The web build has no driver; agents use the desktop binary. Dialog text boxes (New project, the label, the JSON editor) take no `set_field`; `enter_text` fills the one that has the focus, and nothing tells whether one had it. `size` is the view's size on both runners, to within a pixel on Windows.
- **The issue recorder's known limits** (§6.8). Replay's gaps — a key, a drag, a scroll, a long press, development mode — stay manual steps printed by `scripts/replay_tape.py`, never replayed. A picture's measure does not see a value a box shows but cannot render (a height typed as `abc`). Replay resolves against the machine's own shared library, not a copy of the one recorded. The web build keeps its tape in memory and writes nothing. The Linux agent walk was not run for the issue recorder in phase 1.
- **Folders in the script.** **Nothing deletes a version**: a folder or scene taken out of every list stays under *Not in the script* until its file is removed by hand. **Two people who add at the same time get the same number**, and two unrelated first versions of one short name then read as two versions of one scene. **A pinned entry is unpinned only in the JSON editor**, and a scene's words — its blocks — are written only there; the *Script* tab says so on a scene without one. **The move dialog puts a row at the end** of the list chosen; a place among its rows is a drag's, or *Move up* and *Move down* afterwards. **Drag and drop is the tree's alone**: a Contents card reorders by its rows' menus; the agent layer has no drag — every move a drag makes is a menu item — and the issue recorder prints one as a manual step. **Compare at a narrow window** gives a folder's and a scene's rows the two narrow columns every form's rows have had there.
- **Identifiers name the doors, not every control.** Compare's cells (built outside the form's field layout), the Settings *show folder* buttons and the sign-in dialog's secondary buttons carry none yet; tabs never will (§13).
- **Development mode exists** (§9.5) and is on by default outside a release build: another author's version, official without being a director and the shared library warn instead of refusing. What stays enforced near production is not yet decided; the rules that protect files are not governed and refuse in every build.

**Takes on a cloud media root are not discovered by listing.** The loader finds takes by listing a media root that is a `ProjectSource` (§5.9); a root on a service is a `MediaStore` and not a source, so takes there are reached through an entity's `refs` and through the batch records, which are in the project folder. The reference section, the epoch overview's `preview` and the Takes tab's rows for batch-recorded uploads work; a take a colleague put there without a batch record does not appear. Listing a cloud root through `MediaStore.list` is carried forward.

## 16. Future points to address

*Each point says what could go wrong, and where it is handled or still open.*

**The plug-ins' `app:` strings (§6.11, recorded on 17 September 2026).** A plug-in borrows an app string by its ARB key through `filmopen_l10n`'s generated `appStringsByKey` — every string of the app a second time, kept in step by `scripts/gen_app_strings.py` and a test that fails when the map is stale. Until then the generator runs after every ARB edit. No stock plug-in uses an `app:` string.

**The device's key in hardware (§6.6b, recorded on 19 September 2026).** The key is made in Dart and kept in the credential store, which encrypts it for the user; a program running as that user can read it. Made inside the Secure Enclave or the Android Keystore it could never leave the device, which is what the website's R4 (a portal token bound to a device) and R10 (*share*) will lean on. It needs native code per platform; the Keystore and the Enclave sign in DER, which the app then converts to `r || s` (the contract's K4). The id would change with the key, so the move is a new device in the person's list, once.

**The usage log (§6.7).**
- **Live sessions.** The catalogue prices a live transcription per minute of audio.
 - **Where the cost comes from.** OpenAI's SDK gives `conversation.item.input_audio_transcription.completed` a `usage` field, in tokens or in seconds of audio. Whether `gpt-live-transcribe` fills it, and in which unit, is still to be checked. Until then, the cost is the catalogue's price times the minutes sent.
 - **A crash** loses what followed the last `running` record, and the chain stays open, showing that last cost.
 - **Through filmopen.ai.** How a brokered session is settled is open (Portal Specification).
- **Double counting.**
 - **On one machine.** Two copies of the app can share the usage folder, and both ask a platform about the same queued job. Each may write the job's final record, but only the chain's latest record counts, so the job is counted once. The step that builds the log proves this with two writers.
 - **Across devices.** When records reach filmopen.ai, a record keeps its `id`, so a use is counted once however often it is sent (Portal Specification P10).
- **Open chains.** A call that timed out, a cancel the platform did not confirm, and a crash each leave a chain open. The Usage tab counts it by its counted record, as *Totals* says: a `started` or `submitted` chain's estimate as pending or possibly charged, and a `running` chain's cost so far as spent.
 - **A platform may still finish, and charge for, a call the app gave up on.** OpenRouter stops generating on a cancelled stream only for providers that support cancelling; its streaming page names providers that do not, Google among them. fal may complete a job after a cancel is requested.
 - **A `started` chain whose platform never returned an id** cannot be asked about later.
- **A key replaced while jobs are open.** Once the start-up check of §6.7 is built, the app asks only about chains whose key matches the one now stored, so a chain submitted with a key since replaced stays open until the user checks the platform.
- **Corrections** carry the status of the chain's counted record. Whichever record is latest counts, so a correction carrying an earlier status would reopen a finished call.
- **A record that cannot be written after a call has started.** A `submitted` or `running` record waiting for the lock is retried in memory. A crash before it is written loses the platform's request id, so the job cannot be asked about.
- **A file cut short by a crash** could join the next record to its broken line. The writer first ends such a file with a line feed.
- **A lost first record.** A chain whose first record is missing, from a line cut short or a file removed by hand, still counts once through the `ref` its records share, but in the month of its earliest remaining record.
- **Version skew.** A build that shares the folder with a newer one skips every chain holding a record with a newer `v`. It may leave out calls the newer build recorded, but it never counts part of one. Builds that share a folder should share a record version.
- **Clocks.** A writer keeps a chain's times in order, a millisecond past the chain's latest record it has read when its clock has stopped or gone back. Two copies of the app writing to one chain at the same moment can still tie; then the greater `id` counts, and both records carry what the platform said.
- **Estimates.** A call whose request does not bound its cost is estimated at the smallest amount it can cost, so its pending amount understates.
- **The price row.** A `price`-basis cost cannot be recomputed later without the catalogue's price row that applied, and a record does not yet name it.
- **Money against the website.**
 - The website takes provider costs to ten fractional digits and has not chosen a live currency.
 - Device records use twelve digits and the platform's currency, and they never settle (Portal Specification P11).
 - A later format for brokered jobs must follow the website's rule.
- **The lock on Windows** is mandatory, so it is taken only on `.lock`, which no reader opens. A writer that cannot take it within ten seconds does not start a paid call.
- **A folder copied to another machine** keeps its `device.json`, so two machines share a device id until one of them deletes it. The file is made again only when it is read whole and holds no valid id, so a scanner that briefly holds it does not change the id.
- **Names in `purpose`.** File stems can hold people's names. What a record may carry off the device is open (Portal Specification).

**Keys (§6.4, §6.7).**
- **One file holds every secret on Windows.** `flutter_secure_storage` keeps the account's session and every provider key in one DPAPI file, rewrites the whole file on each write, and deletes it when it cannot decrypt it.
 - Within one app, the plugin runs its calls one at a time, so a key save and the account's refresh do not collide.
 - Two copies of the app writing at once can still lose one write. A failed decryption loses every key and the session together.
- **A key pasted into a chat, a shared file or a message** is exposed, and should be replaced.
- **A key's expiry.** A platform key can expire, as OpenAI's keys can. Nothing re-checks a key once it is stored (step 2c), so an expired one keeps its *Verified on* state and fails where it is used; the user makes a new one and saves it over the old.
- **The tab's states can outlive the keys.** A store emptied by a failed decryption, or changed by another program, leaves the preferences' states claiming keys the store no longer holds, and nothing reads the store behind the card, so the card says *Verified on* until the key is saved again (step 2c; the owner's question 12).
- **Keys can outlive their states, too.** A preferences file put back from before a key was saved, as an agent's run puts theirs back, leaves a card saying *No key* while the store holds a key. The store is the source of truth — the step that builds dictation reads the store, not the card — but since step 2c nothing reads it behind the card, so the card says *No key* until the key is saved again.
- **A write the operating system never finishes.** On Windows the plugin retries a failed file write without end, under its own lock. Each call has ten seconds before it fails closed and the queue moves on, but the plugin's lock can still hold the calls behind it, the account session's among them, until the app restarts.
- **Keys handed to devices by the portal, later.** Signing deters copying but cannot prevent it, so a handed-out credential needs a spending limit where the platform offers one (Portal Specification P17).

**Platforms.**
- **ElevenLabs through fal, for now.** fal's voice design returns a voice id when it saves the voice, and fal's dialogue endpoint takes a voice's name or id. Open (Portal Specification):
 - whether fal's single-voice speech endpoint takes a designed voice's id;
 - how long a designed voice lasts;
 - what a design costs.
- **Pending platforms** keep their files and notes, with their obstacles in the index, for later work.
- **Terms.** Whether a portal that runs jobs, or hands out keys, for other people fits each platform's terms is open for OpenRouter, fal, OpenAI and ElevenLabs (Portal Specification).
- **Results served only with the account key**, such as OpenAI's and Veo's videos, would put large files through the portal (Portal Specification).

**Dictation (§9.6).**
- **Turns decided on the device.** The gate's defaults — three times the room, 0.8 s of quiet, 0.2 s of speech, a room of at least 50 that rises at most 3 % a frame and is held under a voice, and a turn cleared as noise where a second or more of it is still as even as a tone when it ends — are untried on real microphones. A voice quieter than three times the room is heard as no speech, and its audio is cleared with the quiet. A noise that is not steady, such as a television, is transcribed, and so is an even sound that stops, such as a beep. A voice whose frames vary by less than twice is taken for a steady noise: the room climbs to it, and a turn of it still sounding at *Stop* or a release is cleared. A steady noise's first seconds are held, then cleared, before the room has learned it. `dictation.ended` carries the numbers that show these (§9.6), never the audio. Should OpenAI take voice activity detection for this model again, its catalogue entry says so first.
- **An answer that never comes.** A commit the platform neither takes nor refuses holds a release or the apply button for its three seconds; the text then applied is what arrived.

**The portal (Portal Specification §8).**
- Where usage records live without a relational database, and the change that asks of the website's contract.
- How provider keys are encrypted.
- FilmOpen's fee on a director's own keys, and in the portal's Usage tab.
- Whether money stays in PostgreSQL.
- Estimates against limits, and how records reach the portal.
