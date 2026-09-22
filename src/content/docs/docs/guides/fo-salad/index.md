---
title: "fo-salad: on-demand ComfyUI servers"
description: "GPU availability, hourly prices and provider-enforced shutdown for cloud ComfyUI."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-salad/index.md
sidebar:
  label: fo-salad
  order: 1
---

Plugin types: [Server Providers](../plugin-types/server-providers/).


**fo-salad** manages servers. [fo-cui](../fo-cui/) connects to ComfyUI, and [fo-cui-zimage](../fo-cui-zimage/) owns the model workflow. Selecting a cloud server does not require a Salad-specific copy of the Z-Image plugin.

This is an **experimental plugin-lab integration**. Live acceptance has demonstrated a 24 GB-stack image saved into character media, deadline renewal without replacing the GPU instance, and automatic provider shutdown after the app process exited. Durable session recovery and compute billing reconciliation still belong to the production app integration.

Enable the plugin, set the Salad **organization and project URL names** in its settings, and add its separate key in **Provider keys**. The API requires those names; a key alone cannot list them. The key stays in the host credential store and is never placed in the GPU container.

In the temporary character render popup:

1. Choose ComfyUI, then **Start server** above Stack.
2. Wait for live availability. Use **Filter GPUs** to narrow the list. Each choice shows the GPU, priority and hourly USD price. The list includes compatible NVIDIA hardware for this recipe; capacity is an estimate, not a reservation.
3. Set inactivity shutdown to **5–60 minutes**, default **15**, then Deploy.
4. Wait for ComfyUI and its models to be ready. Choose the cloud server or local ComfyUI for each render.
5. Use **Shut down selected server**. The popup reports the provider's observed state, which may still be stopping; verify stopped and zero active instances in the Salad portal before treating shutdown as complete. Closing a popup is not an immediate shutdown request.

The first recipe starts from an immutable official Salad runtime image and downloads the existing revision-pinned Z-Image BF16 weights and text encoders. It verifies file sizes and SHA-256 before starting ComfyUI. It supports the Quality and 24 GB Quality stacks; hardware checks still run on the selected server. The runtime listens on IPv6 as required by the authenticated gateway. In-container setup consumes running GPU time, so a future FilmOpen image with common models baked in should reduce paid startup time.

Salad has native **scheduled scaling**, rather than a dedicated inactivity TTL. The plugin creates a stopped group with a zero-replica deadline, reads the rule back, and only then starts one replica. Active work renews that deadline; an idle popup does not. If the app closes, the provider retains the last acknowledged shutdown schedule. Timing has minute granularity plus provider execution delay. [Salad scheduled scaling](https://docs.salad.com/container-engine/how-to-guides/autoscaling/time-of-day-scaling).

Each render keeps its own endpoint through model checks, reference upload, polling and output download. Switching another render to another server does not change the first job's connection. Outputs return through the normal project media importer. Cloud compute is billed by running time; the hourly quote is not a per-image invoice. The prototype's Usage entry records the deployment receipt but does not calculate the GPU session's final bill; its legacy zero estimate must not be interpreted as free cloud compute.

The September 2026 proof used an RTX 3090 at a live quote of **USD 0.117/hour**. Cold provisioning and model setup took about **21 minutes**; the 1024×1024 render itself took **48.54 seconds** in ComfyUI. With a five-minute idle setting, Salad reported stopped and zero active instances about **24 seconds after the scheduled minute**, after the app had exited. These are observations from one node, not guaranteed startup, performance or shutdown times. The example image and both test attempts together cost an estimated seven cents of running time; no provider invoice was reconciled.

Node disk contents are disposable. Bake common models into versioned images or use durable object storage. Salad S4 is useful for temporary input assets, with a 100 MB file limit and 30-day retention; it is not a permanent volume for safetensors. [Salad temporary storage](https://docs.salad.com/storage/explanation/overview).

The provider offer contract covers `capabilities`, `availability`, `deploy`, `servers`, `resolve`, `wake` and `stop`. Raw provisioning and credentials are not shareable operations. Future relay integration should expose bounded model jobs and attribute their compute usage to the correct server session/requester.
