---
title: "fo-salad: on-demand ComfyUI servers"
description: "GPU availability, hourly prices and provider-enforced shutdown for cloud ComfyUI."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-salad/index.md
sidebar:
  label: fo-salad
  order: 1
---

**fo-salad** manages servers. [fo-cui](../fo-cui/) connects to ComfyUI, and [fo-cui-zimage](../fo-cui-zimage/) owns the model workflow. Selecting a cloud server does not require a Salad-specific copy of the Z-Image plugin.

This is an **experimental plugin-lab integration**. The temporary app has the controls and offline/native tests; account-scoped deployment and shutdown acceptance must be completed before treating the feature as proven in production.

Enable the plugin, set the Salad **organization and project URL names** in its settings, and add its separate key in **Provider keys**. The API requires those names; a key alone cannot list them. The key stays in the host credential store and is never placed in the GPU container.

In the temporary character render popup:

1. Choose ComfyUI, then **Start server** above Stack.
2. Wait for live availability. Each choice shows the GPU, priority and hourly USD price. Capacity is an estimate, not a reservation.
3. Set inactivity shutdown to **5–60 minutes**, default **15**, then Deploy.
4. Wait for ComfyUI and its models to be ready. Choose the cloud server or local ComfyUI for each render.
5. Use **Shut down selected server**. The popup reports the provider's observed state, which may still be stopping; verify stopped and zero active instances in the Salad portal before treating shutdown as complete. Closing a popup is not an immediate shutdown request.

The first recipe starts from an immutable official Salad runtime image and downloads the existing revision-pinned Z-Image BF16 weights and text encoders. It verifies file sizes and SHA-256 before starting ComfyUI. It supports the Quality and 24 GB Quality stacks; hardware checks still run on the selected server. In-container setup consumes running GPU time, so a future FilmOpen image with common models baked in should reduce paid startup time.

Salad has native **scheduled scaling**, rather than a dedicated inactivity TTL. The plugin creates a stopped group with a zero-replica deadline, reads the rule back, and only then starts one replica. Active work renews that deadline; an idle popup does not. If the app closes, the provider retains the last acknowledged shutdown schedule. Timing has minute granularity plus provider execution delay. [Salad scheduled scaling](https://docs.salad.com/container-engine/how-to-guides/autoscaling/time-of-day-scaling).

Each render keeps its own endpoint through model checks, reference upload, polling and output download. Switching another render to another server does not change the first job's connection. Outputs return through the normal project media importer. Cloud compute is billed by running time; the hourly quote is not a per-image invoice. The temporary integration retains unknown cost and a deployment receipt instead of reporting cloud compute as free.

Node disk contents are disposable. Bake common models into versioned images or use durable object storage. Salad S4 is useful for temporary input assets, with a 100 MB file limit and 30-day retention; it is not a permanent volume for safetensors. [Salad temporary storage](https://docs.salad.com/storage/explanation/overview).

The provider offer contract covers `capabilities`, `availability`, `deploy`, `servers`, `resolve`, `wake` and `stop`. Raw provisioning and credentials are not shareable operations. Future relay integration should expose bounded model jobs and attribute their compute usage to the correct server session/requester.
