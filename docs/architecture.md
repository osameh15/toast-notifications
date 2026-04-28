# Architecture

This document describes how the pieces of `nuxt-toast-notification` fit together at runtime — useful if you're customizing aggressively, debugging, or contributing.

## File layout

```
src/
├── module.ts                         # Nuxt module entry point
└── runtime/
    ├── components/
    │   ├── ToastNotification.vue     # Single toast UI
    │   └── ToastContainer.vue        # Stack of toasts + Hide-all button
    ├── composables/
    │   └── useToast.ts               # Public API + module-level state
    ├── assets/
    │   ├── fonts/Shabnam/*.woff2     # Bundled Persian font
    │   └── styles/toast-fonts.css    # @font-face declarations
    └── plugin.client.ts              # Auto-mount client plugin
```

`module.ts` is the only file the consumer's Nuxt build evaluates directly. Everything under `runtime/` is registered with Nuxt as a path string and pulled in lazily by the consumer's app at the right time.

## Module lifecycle (consumer-side)

When a consumer adds `nuxt-toast-notification` to `modules` in `nuxt.config.ts`, Nuxt runs `module.ts#setup` once at build time:

1. Merge user options with defaults via `defineNuxtModule({ defaults })`.
2. Push runtime config under `runtimeConfig.public.toast` so it survives into client-side code.
3. Call `addComponent` twice — registers `<ToastNotification>` and `<ToastContainer>` so consumers can use them globally without imports.
4. Call `addImports({ name: 'useToast', from: ... })` — auto-imports the composable.
5. If `loadShabnamFont`, push the `toast-fonts.css` path onto `nuxt.options.css` so Vite bundles the @font-face declarations and the woff2 files.
6. If `loadInterFont`, append three `<link>` tags to `nuxt.options.app.head.link` (preconnect to fonts.googleapis.com, preconnect to fonts.gstatic.com, stylesheet from googleapis).
7. If `autoMount`, register `runtime/plugin.client.ts` as a client-only plugin.

By the time the consumer's app boots in the browser, all of the above is wired in — the consumer just calls `useToast().success(...)`.

## Runtime state model

State lives at **module scope** in `useToast.ts`:

```ts
const toasts = ref<ToastInstance[]>([])
const config = reactive<ToastConfig>({ maxToasts: 3, defaultTimeout: 5000 })
let nextId = 0
```

These are not closures over `useToast()` — they are top-level module bindings. Every `useToast()` call returns a fresh object whose methods reach into the same shared `toasts` and `config`.

That choice has two consequences:

1. **Multiple `<ToastContainer>` instances all see the same stack.** Mount one in your default layout, another in a modal — both render the same toasts.
2. **State survives across separate Vue app instances on the same page.** This is what makes the auto-mount plugin work (see below).

`config` is exposed publicly via `readonly(config)` so consumers can read it reactively but mutations have to go through `setConfig(partial)`.

## The auto-mount plugin

If `autoMount: true` (default), `plugin.client.ts` runs once on the client:

```ts
const cfg = useRuntimeConfig().public.toast
_setToastConfig({ maxToasts: cfg.maxToasts, defaultTimeout: cfg.defaultTimeout })

const root = document.createElement('div')
root.id = 'nuxt-toast-notification-root'
document.body.appendChild(root)

const app = createApp({ render: () => h(ToastContainer, { position: cfg.position }) })
app.mount(root)
```

Two things to notice:

- It pulls the user's module options off `useRuntimeConfig().public.toast` and seeds `config` via the internal setter. This bridges build-time options into the runtime singleton.
- It creates a **separate Vue application instance** to render `<ToastContainer>`, mounted into a div appended to `<body>`. The consumer's main Vue app is not touched.

### Why a separate Vue app?

Two alternatives were considered:

- **Inject into the consumer's app via a Nuxt plugin (`nuxtApp.vueApp.component(...)`)**. Forces the consumer to add `<ToastContainer />` somewhere in their template. Defeats the auto-mount goal.
- **Use Nuxt's `app:mounted` hook to find an anchor and inject**. Fragile — depends on app structure.

Mounting a tiny dedicated Vue app on a body-level div is the simplest pattern that works without touching consumer markup. The cost is one extra Vue instance, which is negligible for a UI element this small.

### Why state still syncs across two Vue apps

Because `toasts` is a module-level `ref`, both Vue app instances import the same singleton. When `useToast().success(...)` (called from the consumer's app) mutates `toasts.value`, Vue's reactivity system notifies every active effect — including the render effect inside the auto-mount app's `<ToastContainer>`. That's why a toast call from anywhere in the consumer's app shows up in the auto-mounted container.

## Component layering

```
<ToastContainer>              ← positions the stack, renders Hide-all button
  └─ <ToastNotification>      ← single toast: card, icon, text, close button
        ↑ v-for over toasts ref
```

`ToastContainer` does three things:

1. Reads `toasts` from `useToast()`, iterates with `v-for`.
2. Wraps the rendered output in `<Teleport to="body" :disabled="!teleport">` so `position: fixed` always references the viewport.
3. Conditionally renders the Hide-all button when `toasts.length >= 2`. Uses CSS `order` so the button appears at the visual top of the stack regardless of `flex-direction`:
   - `top-*` positions use `flex-direction: column` → button gets `order: -1`
   - `bottom-*` positions use `flex-direction: column-reverse` → button gets `order: 999`

`ToastNotification` is a self-contained card. The `<Teleport>` lives one level up so the toast stack is teleported as a unit, not per-toast.

## Teleport semantics

`<Teleport to="body">` moves the rendered DOM into `<body>` while keeping the Vue component in its original position in the component tree. That means:

- `position: fixed` always references the viewport, even if the consumer mounts `<ToastContainer />` inside an ancestor with `backdrop-filter`, `transform`, `filter`, `perspective`, `will-change`, or `contain` (any of which would otherwise create a new containing block — see the spec on [containing blocks](https://www.w3.org/TR/css-position-3/#cb)).
- Reactive bindings still work — props flow normally, events bubble normally up the component tree, just not through DOM traversal.

The container's auto-mount instance teleports from `#nuxt-toast-notification-root` to `body`, leaving `#nuxt-toast-notification-root` as an empty placeholder. Manual `<ToastContainer />` mounts teleport from wherever the consumer placed them. Either way the rendered `.toast-container` is a direct child of `<body>`.

## RTL auto-detection

`ToastNotification.vue` computes a per-toast direction:

```ts
const RTL_SCRIPT = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻾]/
const direction = computed(() =>
  RTL_SCRIPT.test(props.title) || RTL_SCRIPT.test(props.message) ? 'rtl' : 'ltr'
)
```

Detection is per-character against the script blocks for Arabic, Arabic Supplement, Arabic Extended-A, and Arabic Presentation Forms-A and -B. Hebrew is not currently included; if you need it, extend the regex to cover U+0590–05FF (PRs welcome).

The `dir` attribute is bound on the `.toast-card` element. CSS uses `[dir='rtl']` selectors and the `margin-inline-end` logical property so layout flips automatically:

```css
.toast-card[dir='rtl'] .toast-close-btn {
  right: auto;
  left: 8px;
}

.toast-icon {
  margin-inline-end: 12px;  /* logical: right in LTR, left in RTL */
}
```

Title and message text already use `text-align: center`, so no further changes are needed for centering.

## Build pipeline

`@nuxt/module-builder` (which wraps `unbuild`) handles packaging:

- `nuxt-module-build build` — emits `dist/module.mjs` (module entry), `dist/module.d.mts` (types), and copies `runtime/` (compiled `.ts` → `.mjs`, `.vue` files preserved, woff2 / css copied as static assets).
- `nuxt-module-build prepare` — generates type stubs in `.nuxt/` for IDE tooling.
- `nuxt-module-build build --stub` — emits a stub `dist/module.mjs` that defers to source files via jiti, used during dev.

Output ends up in `dist/`, which is the only directory shipped to npm (per `files: ["dist"]`).
