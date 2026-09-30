---
title: "fo-cui: ComfyUI platform"
description: "Connect model adapters to a local or selected ComfyUI server."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-cui/index.md
sidebar:
  label: fo-cui
  order: 1
---

Plugin types: [Platform Connectors](../plugin-types/platform-connectors/).

Connect FilmOpen to ComfyUI running on your own computer, or use a server managed by [Salad](../fo-salad/). This connector does not install or start ComfyUI. Rendering also needs a model adapter, such as [Z-Image Turbo](../fo-cui-zimage/) or [LTX video](../fo-cui-ltx/).

## Set up

1. Start ComfyUI separately. Confirm its own page opens at the address it reports.
2. Follow the [package installation steps](../plugin-packages/#install-and-allow), then open **Settings → Plugins → ComfyUI** and allow it.
3. Under **Settings on this computer**, set **ComfyUI server** to the full URL. The usual local value is `http://127.0.0.1:8188`; a bare `127.0.0.1` lacks the scheme and port.
4. Press **Check** under **Can it work?**. This checks the server, not the contents of your model files. A CPU-only server and a missing GPU are different from a connection failure.
5. Enable a model adapter and follow its guide. A successful Check alone does not generate an image.

## Enable model verification and downloads

ComfyUI lists installed filenames, but that cannot prove that their bytes are correct. The optional **Model verification service** performs pinned size and SHA-256 checks and downloads missing Z-Image files. It is a separate Python process on the computer that owns the ComfyUI models.

1. Obtain the matching [filmopen-plugins source](https://github.com/filmopen-ai/filmopen-plugins) and use Python 3.11 or later. Run the following from the repository root, replacing the model directory with your actual ComfyUI model directory.

   Windows PowerShell:

   ```powershell
   python tools/model_service.py --models "C:/path/to/ComfyUI/models" --manifest fo-cui-zimage/assets/models.json --port 8189
   ```

   Linux:

   ```bash
   python3 tools/model_service.py --models "/path/to/ComfyUI/models" --manifest fo-cui-zimage/assets/models.json --port 8189
   ```

2. Keep that process running. Set **Model verification service** on the ComfyUI plugin page to the URL it prints, normally `http://127.0.0.1:8189`.
3. Check that this helper serves the **same model root** as the ComfyUI server configured above. A working helper pointed at another installation cannot prepare this server.
4. On the Z-Image plugin page, run the selected stack's **Verify** or **Download missing files** action. Wait for its result, then open Render separately.

The helper binds to loopback. Do not expose it publicly or point a local helper at a remote Salad server: it would operate on the wrong computer. Salad's recipe installs its own pinned files.

With no helper URL, model preparation returns `unconfigured`. If a configured helper cannot be reached, the package reports `model-service-unavailable`. A connection Check can still pass in either case. Nothing has downloaded merely because an action ended or the server was reachable.

Repair installs **only missing files** into their approved categories. An existing corrupt file is reported and preserved for operator review; it is not silently overwritten. Closing FilmOpen does not stop a download already accepted by the helper. A timeout may leave it running: check that process before asking again.

## Check the result

Follow the Z-Image guide to generate one small image, open the resulting tile, and confirm that it belongs to the character and appears in its takes. File verification and a completed render are separate checks.

The connector submits executable ComfyUI API graphs, not UI-save workflow documents. It does not clear the whole queue or interrupt unrelated GPU work. After a timeout or lost submission response, check the job before explicitly retrying; no automatic paid or GPU resubmission is safe merely because FilmOpen stopped waiting.

Raw server access, workflow submission and file installation are not shareable operations. Proposed sharing metadata enables no relay. [ComfyUI protocol](https://github.com/Comfy-Org/ComfyUI/blob/master/server.py).
