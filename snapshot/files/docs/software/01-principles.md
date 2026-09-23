# Design principles

## 2. Design principles

These follow directly from the format's own principles (Project Specification §2).

1. **Warn, don't enforce.** No file is rejected for being imperfect. A header that disagrees with its filename, a field of the wrong type, a segment that is too long, an unknown file: each is a warning the user can see, never a crash and never a silent fix. The loader tolerates any JSON that parses to an object.
2. **Never guess.** When the format says a reader must report rather than choose, the application reports. An ambiguous reference (several authors, nothing official, no viewer) is *unresolved*, not first-match. A folder with several project authors and no official pointer *asks* which to open. An implicit epoch falls back to `default` only, never to "whatever exists".
3. **The files are the only state.** Every write goes to a file through the project's `ProjectSource`, and the project is re-read afterwards; nothing is edited in memory and saved later. The app writes only under the viewer's own handle (§17, §18.3 of the format): a form is offered on the viewer's own version and Fork on everyone else's; the official pointer is a director's to write and to remove; the pick lives in the viewer's own commentary file. Reads and writes are confined to the project folder; the media root and the library are sandboxes of their own, and the library is never written. Creating a project refuses a folder that already holds files.
4. **The model knows the format, not the screen.** Everything in `filmopen_format` and `filmopen_store` is pure Dart, free of Flutter and free of user-facing text. Diagnostics are codes with arguments. The core is testable without a widget tree and is a package of its own that a command-line tool or a server could import.
5. **Language-independent by construction.** Every string a person reads comes from a localisation file, including the display labels for the format's own field names, entity types and counts. The format's JSON keys are never translated; the screen is.
6. **One navigation path.** Whatever is clicked, in the tree or in the detail pane, goes through one controller that sets what is shown, highlights the matching tree row and reveals it.
7. **Small, honest surface.** The application says what it does not do (placeholders show a message, the README says "nothing writes yet"). Product text is not aspirational.
8. **Model after API Dash.** The window layout follows the API Dash desktop client: a narrow icon rail, a resizable sidebar, a main pane. One component is adapted from it under its licence; the rest is FilmOpen code.
