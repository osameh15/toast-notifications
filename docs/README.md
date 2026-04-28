# Documentation

Technical reference for `nuxt-toast-notification`.

The main [README](../README.md) covers installation, options, and the public API. The pages here go deeper for users and contributors who need to understand how the module is built or want to customize it beyond the basics.

## Contents

| Doc | What's in it |
| --- | --- |
| [Architecture](./architecture.md) | How the module, runtime composable, components, and auto-mount plugin fit together. State sharing across Vue app instances. Teleport behavior. RTL detection flow. |
| [Customization](./customization.md) | Override styles, replace fonts, theme per-type, custom animations, manual mounting, multiple containers, accessibility. |
| [Design decisions](./design-decisions.md) | Q&A on the major choices — no Vuetify, separate Vue app for auto-mount, module-level state, Teleport, auto-RTL, font strategy, Nuxt 3+4 support. |
| [Contributing](./contributing.md) | Local dev setup, testing, conventions, release workflow. |
