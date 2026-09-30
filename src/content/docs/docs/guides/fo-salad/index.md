---
title: "fo-salad: on-demand ComfyUI servers"
description: "GPU availability, hourly prices and provider-enforced shutdown for cloud ComfyUI."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-salad/index.md
sidebar:
  label: fo-salad
  order: 1
---

Plugin types: [Server Providers](../plugin-types/server-providers/).

**fo-salad** starts and manages GPU servers. [fo-cui](../fo-cui/) connects to their ComfyUI service, and a model adapter such as [fo-cui-zimage](../fo-cui-zimage/) supplies the workflow. A cloud destination does not need a Salad-specific Z-Image plugin.

## Set up and deploy

1. [Install and allow](../plugin-packages/#install-and-allow) **fo-salad**, **fo-cui** and the model adapter you want to use.
2. On the Salad plugin page, enter **Organization URL name** and **Project URL name**. These are the names in your portal URL, not display titles. The API requires them; a key alone cannot discover them.
3. In **Settings → Provider keys**, save the Salad plugin's key and check its verification result. Allow the package's declared permissions.
4. Open an editable character's media add control and choose **Render**, then **Start server**.
5. Wait for current offers. The check queries multiple GPU classes and may take around a minute or longer; it starts no servers. Select the provider, GPU and priority at the displayed hourly price. Availability is an estimate, not a reservation.
6. Set the inactivity period between **5 and 60 minutes**; the default is **15**. Press **Deploy** once and follow the server's state.
7. Wait until the server can accept work. Select that destination under **Runs on**, then choose a compatible **Way of running it**.

Provisioning and downloading model files consume paid GPU time. A deployed instance is not necessarily ready to render yet.

Use **fo-salad v3 or later** for the current availability check. Its recipe requests at least **4 vCPUs, 24 GiB RAM and 50 GiB disk**, subject to the GPU class's own requirements. The older 80 GiB disk request could exclude otherwise available hosts. An empty offer list therefore does not by itself mean the API key is invalid: compatible capacity must satisfy all requested resources.

Quotes expire after five minutes. Deployment checks capacity again before creating a group; if it reports `capacity-changed`, refresh the choices and select a new offer. That refusal occurs before creating a server. If a later deployment request times out or its response is lost, check the server list and portal before repeating it.

## Models and the server connection

The supplied recipe installs Z-Image BF16 Quality dependencies and text encoders. It supports the 8 GB Quality and 24 GB Quality configurations when the selected hardware meets their requirements. It does **not** install the INT8 Fast or LTX dependencies. Choose a recipe-installed model/stack; more VRAM alone does not add missing weights.

FilmOpen reaches ComfyUI through Salad's authenticated gateway. The management key stays in FilmOpen's credential store, not in the container or a public URL. Each render retains its chosen server for verification, reference upload, execution and media download; changing another dialog's destination does not retarget that job.

Do not configure your local loopback model helper to repair a cloud server. It operates on local disk. The cloud recipe owns the remote installation.

## Test and stop

1. For an image test, choose the smallest supported Quality resolution, enter a short prompt and press **Render** once.
2. Confirm the resulting tile opens, belongs to the intended character and has a Usage record. Compute billing is by running time; an image adapter's zero additional API cost does not mean free GPU time.
3. In the server panel press **Stop**. FilmOpen waits for Salad to report the outcome. Confirm **stopped** and **zero active instances** in the portal before treating the server as stopped.
4. If FilmOpen loses contact, inspect that group independently. Closing a dialog is not a shutdown request.

Salad uses scheduled scaling for the shutdown deadline. The plugin creates a stopped group, installs a zero-replica deadline, checks it, then starts one replica. Active work renews the deadline; if FilmOpen disappears, the last acknowledged provider schedule remains. Allow for minute granularity and provider execution delay. [Scheduled scaling](https://docs.salad.com/container-engine/how-to-guides/autoscaling/time-of-day-scaling).

A September 2026 lab run observed about 21 minutes of cold provisioning/model setup, followed by a 48.54-second 1024×1024 render on an RTX 3090. That is a historical observation, not a startup guarantee or a new verification of this app build. Live capacity, prices and download speed vary.

Cloud integration is still being verified. A later Windows test reached an authenticated, ready server, but lost the gateway during its first render and recovered no image. The server was stopped and its zero active instances independently confirmed. The app's availability dialog also returned an empty list when a separate provider check found offers. Until these paths are resolved, inspect the portal after an interrupted request and do not submit a replacement job automatically: the first job's outcome may be unknown.

Node disk is disposable. The recipe downloads pinned files; persistent model images/object storage are future deployment work. Cloud-session costs shown from duration and an hourly quote are estimates, not reconciled invoices. Raw provisioning, management credentials and server access are not shareable operations.
