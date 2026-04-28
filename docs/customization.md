# Customization

The toast component is intentionally easy to override at every level — color per type, sizes, animation, fonts, even the icons. This page is the deep dive; the README's "Customization" section is the quick version.

## Where styles live

| Stylesheet | Scope | Loaded by |
| --- | --- | --- |
| `<style scoped>` inside `ToastNotification.vue` and `ToastContainer.vue` | Component-scoped (Vue scoped CSS hash) | Bundled with the components |
| `runtime/assets/styles/toast-fonts.css` | Global `@font-face` rules | Pushed onto `nuxt.options.css` when `loadShabnamFont: true` |
| Inter via Google Fonts | Global stylesheet `<link>` | Appended to head when `loadInterFont: true` |

Because the component CSS is scoped, you can't override a class by name from a parent component's `<style scoped>`. Use one of the patterns below instead.

## Override pattern 1 — global stylesheet targeting the root

The auto-mounted container lives in a body-level div with id `nuxt-toast-notification-root`. Any global stylesheet (e.g. `assets/css/main.css` registered via `nuxt.config.ts#css`) can target descendants of that root:

```css
/* assets/css/main.css */
#nuxt-toast-notification-root .toast-card {
  min-width: 280px;
  max-width: 380px;
}

#nuxt-toast-notification-root .toast-healthy {
  border-color: #10b981;     /* override the green */
}

#nuxt-toast-notification-root .toast-title {
  font-weight: 700;
}
```

This works because Vue's scoped CSS adds a data-attribute selector to internal rules but does **not** prevent global CSS from matching the same elements.

## Override pattern 2 — `:deep()` from a parent component

If you mount `<ToastContainer />` manually inside one of your own components, you can pierce its scope using `:deep()`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
    <ToastContainer position="top-right" />
  </NuxtLayout>
</template>

<style scoped>
:deep(.toast-card) {
  border-radius: 16px;
}
:deep(.toast-warning) {
  border-color: #f59e0b;
}
</style>
```

This is more localized than option 1 — it only applies if the toast is rendered through a manual mount inside this component's tree.

## Class reference

Use these as targets for your overrides:

| Class | Where | Description |
| --- | --- | --- |
| `.toast-container` | `ToastContainer` root | Fixed-position flex container holding the stack |
| `.toast-position-{position}` | `ToastContainer` root | One of six positions; controls anchor + flex-direction |
| `.toast-card` | `ToastNotification` root | The card itself — width, padding, gradient, border |
| `.toast-{type}` | `ToastNotification` root | One of `toast-healthy`, `toast-warning`, `toast-error`, `toast-info` — sets the border color |
| `.toast-close-btn` | inside `.toast-card` | The X button (top-right LTR, top-left RTL) |
| `.toast-header` | inside `.toast-card` | Flex row holding the icon + title |
| `.toast-icon` | inside `.toast-header` | Wraps the SVG icon; color set inline per type |
| `.toast-title` | inside `.toast-header` | The title text |
| `.toast-body` | inside `.toast-card` | Flex row holding the message |
| `.toast-message` | inside `.toast-body` | The message text |
| `.hide-all-btn` | child of `.toast-container` | The "Hide all" button shown when 2+ toasts visible |

The component also sets `[dir='rtl']` on `.toast-card` when title or message contains Arabic/Persian script. Use that attribute selector for direction-specific tweaks.

## Theming per type

Each type's color appears in three places: the border, the icon, and (for some custom designs) shadows or accents. The cleanest swap is to override the border on the type class and the icon's inline color.

```css
/* In a global stylesheet */
#nuxt-toast-notification-root .toast-healthy { border-color: #10b981; }
#nuxt-toast-notification-root .toast-warning { border-color: #f59e0b; }
#nuxt-toast-notification-root .toast-error   { border-color: #ef4444; }
#nuxt-toast-notification-root .toast-info    { border-color: #3b82f6; }
```

The icon color is set as an inline style (`:style="{ color: iconColor }"` in `ToastNotification.vue`), so global CSS can't override it directly. The cleanest path: set `--toast-icon-color` on the wrapper and refactor your local copy of the component, or wrap the toast in a custom container component. For most use cases the default colors look fine — overriding just the border is enough for branding.

## Custom animation

The slide-in/slide-out is a Vue `<transition name="toast-slide">`. Override the `enter`/`leave` classes globally:

```css
/* Fade instead of slide */
.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: none;        /* cancel the translateX(100%) */
  opacity: 0;
}
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.4s ease;
}
```

You'll need this in a global stylesheet — the `.toast-slide-*` classes live in the component's scoped CSS and won't accept scoped overrides without `:deep()`.

## Font replacement

### Disable the bundled fonts

```ts
// nuxt.config.ts
toast: {
  loadShabnamFont: false,
  loadInterFont: false,
}
```

With both off, the toast inherits whatever font the consumer's body uses (or falls back to the system stack `system-ui, -apple-system, ...` defined in the component CSS).

### Replace with your own

After disabling the bundled options, register your own fonts globally and target the toast classes:

```css
/* assets/css/main.css */
@font-face {
  font-family: 'Vazirmatn';
  src: url('/fonts/Vazirmatn.woff2') format('woff2');
  font-weight: 100 900;     /* variable font */
  font-display: swap;
}

#nuxt-toast-notification-root .toast-card,
#nuxt-toast-notification-root .toast-title,
#nuxt-toast-notification-root .toast-message {
  font-family: 'Vazirmatn', system-ui, sans-serif;
}
```

## Manual mounting and multiple containers

Set `autoMount: false` to take full control:

```ts
// nuxt.config.ts
toast: { autoMount: false }
```

```vue
<!-- app.vue or a layout -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ToastContainer position="bottom-right" />
  <ToastContainer position="top-center" :show-hide-all-button="false" />
</template>
```

Both containers subscribe to the same toast state. A single `useToast().info(...)` shows up in both. Useful for split layouts (admin panel showing notifications in two regions).

If you mount a container inside an element that creates a containing block (`backdrop-filter`, `transform`, `filter`, `perspective`, `will-change`, or `contain`), `position: fixed` would normally measure against that ancestor instead of the viewport. The container handles that by default — its template wraps everything in `<Teleport to="body">`. To opt out (e.g. for testing), pass `:teleport="false"`.

## Accessibility

- The toast card has `role="alert"` and `aria-live="polite"` — screen readers announce new toasts when they appear without interrupting current speech.
- The close button has `aria-label="Close notification"`.
- The Hide-all button uses standard `<button>` with visible text.

If you change the icon-only close button or alter the markup heavily, preserve those attributes so assistive tech still works.

## Localized labels

The Hide-all button label is configurable per container:

```vue
<ToastContainer hide-all-label="پاک کردن همه" />
```

For per-toast localization, `title` and `message` are passed as plain strings — feed them through your i18n layer:

```ts
const { t } = useI18n()
const toast = useToast()
toast.success(t('save.success.title'), t('save.success.message'))
```

Auto-RTL detection picks up Persian/Arabic text whether it comes from i18n keys or hardcoded strings.
