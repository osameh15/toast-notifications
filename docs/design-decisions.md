# Design decisions

The major choices behind the module, and why each was picked over the obvious alternatives. Reading this is optional for using the library — useful when you want to understand the trade-offs, contribute, or fork.

## Why no Vuetify dependency?

The original toast component this module is descended from used Vuetify's `v-card`, `v-btn`, `v-icon`, `v-row`, and `v-col`, plus MDI icon font. Three problems with shipping that as a library:

1. **Hard peer dependency on Vuetify.** Every consumer would need Vuetify installed and registered, ruling out projects on Tailwind, UnoCSS, plain Nuxt UI, or any other ecosystem.
2. **Larger bundle for consumers who already had a UI kit** — a v-btn for a single close button is overkill.
3. **Style coupling.** Vuetify's theme system and CSS variables would need to be respected, adding maintenance.

The library uses plain HTML, scoped CSS, and inline SVG icons (Feather-style stroke icons matching the four MDI icons used). The visual contract (gradient, border colors, sizing, animation) is preserved exactly — verified pixel-by-pixel against the original.

**Trade-off:** the library can't reuse Vuetify's theme variables, so theming is "override CSS" rather than "set Vuetify primary color". For a single-component module this is acceptable.

## Why a separate Vue app for the auto-mount plugin?

Two alternatives:

- **Inject the container into the consumer's app via a Nuxt plugin** — would require reaching into the consumer's app structure. The cleanest way is to ask the consumer to render `<ToastContainer />` themselves, which defeats "auto-mount".
- **Use the `vue:setup` Nuxt hook to inject a global component instance.** Possible but the API is unstable and the result is fragile.

The chosen approach: `createApp({ render: () => h(ToastContainer) }).mount(bodyDiv)`. The cost is one tiny Vue app instance — irrelevant for a static UI element. The benefit is total isolation from the consumer's render tree.

This is only viable because of the next decision.

## Why module-level state (not Pinia, not provide/inject)?

The toast stack lives in `useToast.ts` as a top-level `const toasts = ref(...)`. Three reasons:

1. **Cross-Vue-app state sharing.** With module-level refs, the auto-mount plugin's separate Vue app sees the same `toasts.value` as the consumer's main app. Pinia stores are bound to a Pinia instance which is bound to a Vue app — that wouldn't work for the auto-mount approach.
2. **Zero-config for consumers.** No need to install Pinia, no need to wrap a layout in a provider, no need to register a plugin.
3. **Simpler API surface.** `useToast()` returns plain functions; no instance plumbing.

**Trade-off:** the state is global (one stack per page). Multiple containers all subscribe to the same stack. For toast notifications this is the desired behavior — toasts are inherently global UI.

## Why Teleport on `<ToastContainer>`?

`position: fixed` is supposed to anchor to the viewport. But any ancestor with `backdrop-filter`, `transform`, `filter`, `perspective`, `will-change`, or `contain: layout/paint/strict/content` becomes the **containing block** for fixed-position descendants. This is in the spec — see [containing block algorithm](https://www.w3.org/TR/css-position-3/#cb).

This caused a real bug on the playground's manual-mount page: the brand header card uses `backdrop-filter: blur(12.5px)`, so a `<ToastContainer position="top-center" />` inside that card rendered at the top of the card, not the top of the screen.

`<Teleport to="body">` always escapes the consumer's component tree and lands the container as a direct child of `<body>` — no ancestor can become the containing block. The `:disabled="!teleport"` prop lets users opt out, but the default is `true` because the bug is silent and confusing when it bites.

## Why auto-detect RTL from text content?

Three options were considered:

- **Always LTR.** Simplest, but Persian/Arabic text would have the close button awkwardly on the right and the icon spacing wrong.
- **Explicit `dir` prop on `useToast.show({ dir: 'rtl' })`.** More control, but every Persian-only app would have to set it on every call. And mixed-content apps would have to detect themselves.
- **Auto-detect from title or message.** Requires no consumer code, works correctly out of the box for any combination.

The cost is a tiny regex per toast (run once on creation, not per render). Worth it for the zero-config experience.

The detection regex covers Arabic, Arabic Supplement, Arabic Extended-A, and Arabic Presentation Forms-A and -B. Hebrew is not included — Persian/Arabic was the explicit requirement and Hebrew has slightly different bidi behavior. PRs to extend this are welcome.

## Why is `success` aliased to `healthy`?

The original component used `healthy` as the type name (matching the project's domain — green = healthy system status). When packaging for general use, "success" is the industry-standard name (toast libraries, Material UI, Tailwind UI, etc. all use it).

Both work:

```ts
toast.success('Saved', 'OK')           // public-facing alias
toast.show({ type: 'healthy', ... })   // original name still accepted
```

Internally, `success` normalizes to `healthy` so the CSS class stays `.toast-healthy`. Renaming the class would break consumers who already overrode it via CSS.

## Why Inter via Google Fonts but Shabnam bundled?

| Font | Source | Reason |
| --- | --- | --- |
| Inter (Latin) | Google Fonts CDN, opt-out via `loadInterFont: false` | Inter is ubiquitous; many apps already load it. Bundling would be wasted bytes when the consumer already has it. CDN means cached cross-site after first hit. |
| Shabnam (Persian) | Bundled woff2, opt-out via `loadShabnamFont: false` | Shabnam is much less common — most consumers won't have it. Bundling guarantees correct rendering offline and avoids a CDN dep for fewer users. |

Both load with `unicode-range` (Shabnam) or `&display=swap` (Inter) so they don't block first paint.

## Why woff2 only (no woff/ttf fallback)?

Browser support for woff2:

- Chrome 36+ (2014)
- Firefox 39+ (2015)
- Safari 12+ / iOS 12+ (2018)

For a 2026 library targeting Nuxt 3.13+ / Nuxt 4 — which themselves require modern browsers — woff2 is enough. Adding woff fallbacks would roughly double the bundle weight to support browsers no consumer is testing against anyway.

If a downstream consumer needs IE11 or pre-2018 Safari, they can disable `loadShabnamFont` and supply their own font with whatever fallback chain they need.

## Why support Nuxt 3 AND 4 in the peer range?

`compatibility.nuxt: '^3.13.0 || ^4.0.0'`. Reasons:

- Nuxt 4 is the current major; Nuxt 3 is in maintenance but still used widely.
- The module API (`defineNuxtModule`, `addComponent`, `addImports`, `addPlugin`) is identical between 3.13+ and 4.x.
- The runtime API (`useRuntimeConfig`, `defineNuxtPlugin`) is identical.
- No reason to fragment the user base.

Dev dependencies (`nuxt`, `@nuxt/schema`) are pinned to Nuxt 4 because that's what the official module starter uses, and `@nuxt/cli@3.34+` (transitive) requires `@nuxt/schema@4`. The `commander` peer mismatch this caused is documented in `package.json#overrides`.

## Why is `_setToastConfig` exported (deprecated alias)?

`_setToastConfig` is the same function as the public `setConfig`. The reasons it's still exported as a separate name:

- The auto-mount plugin imports it from the composable file. Renaming the import to `setConfig` would work, but the underscore-prefix made it clear the function was internal at the time it was added.
- After exposing `setConfig` publicly, removing `_setToastConfig` would be a breaking change for anyone who imported it directly (rare, but possible — module-level exports are reachable).

Cost of keeping the alias: 1 line. Benefit: preserves backward compatibility through the 1.x line. It can be removed in 2.0 if it ever becomes inconvenient.

## Why is the Hide-all button hidden with 0 or 1 toasts?

UX:

- 0 toasts — nothing to hide, button is meaningless.
- 1 toast — the per-toast close button is right there. A second "hide all" button next to it adds clutter without saving a click.
- 2+ toasts — clicking each close button takes N clicks. Hide-all is a 1-click win.

The threshold is `toasts.length >= 2` and is expressed in the container as `showHideAll = computed(() => props.showHideAllButton && toasts.value.length >= 2)`. To hide it always, pass `:show-hide-all-button="false"`.

## Why use CSS `order` to position the Hide-all button?

The button has to appear at the **visual top** of the stack regardless of position. Bottom-anchored stacks (`bottom-right`, etc.) use `flex-direction: column-reverse`, which inverts source order vs visual order.

Three implementation options:

- **Two `<template v-if>` branches** — one for "button before toasts" (top positions), one for "button after toasts" (bottom positions). Verbose, easy to introduce drift between the two copies.
- **Conditional class with `:first-of-type` / `:last-of-type` tricks.** Fragile, depends on exact sibling structure.
- **CSS `order`.** One template, two CSS rules. Clean.

```css
.toast-position-top-* .hide-all-btn { order: -1; }      /* lays out first → top */
.toast-position-bottom-* .hide-all-btn { order: 999; }  /* lays out last → reversed → top */
```

Source order stays natural; visual order is computed from `order` + `flex-direction`. Adding more positions later (e.g. `middle-right`) would just need a third rule.
