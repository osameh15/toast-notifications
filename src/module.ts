import {
  defineNuxtModule,
  addComponent,
  addImports,
  addPlugin,
  createResolver,
} from '@nuxt/kit'

export type ToastPosition
  = | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'

export interface ModuleOptions {
  /** Default position of the toast container. Defaults to `bottom-right`. */
  position?: ToastPosition
  /** Maximum number of toasts visible at once. Older toasts are dropped. Defaults to `3`. */
  maxToasts?: number
  /** Default auto-dismiss timeout in milliseconds. Set `0` to disable. Defaults to `5000`. */
  defaultTimeout?: number
  /**
   * Initial visual theme. `'dark'` keeps the original dark gradient look;
   * `'light'` swaps colors for a light card on a dark or light page. Can
   * also be changed at runtime via `useToast().setTheme(...)`. Defaults to `'dark'`.
   */
  theme?: 'dark' | 'light'
  /** Component name prefix. Defaults to `Toast` (so components are `<ToastNotification>` and `<ToastContainer>`). */
  prefix?: string
  /**
   * If true, a `<ToastContainer>` is mounted automatically on the client and
   * you only need to call `useToast()`. If false, mount `<ToastContainer />`
   * yourself somewhere in your app (e.g. `app.vue`). Defaults to `true`.
   */
  autoMount?: boolean
  /**
   * Inject bundled Persian "Shabnam" font (5 weights, woff2) via @font-face.
   * Uses unicode-range so the file is only downloaded for documents that
   * actually contain Arabic / Persian script. Defaults to `true`.
   */
  loadShabnamFont?: boolean
  /**
   * Add Inter (Google Fonts) as the modern English UI typeface via a
   * `<link>` in the document head. Set `false` if you self-host fonts or
   * want to avoid the network request. Defaults to `true`.
   */
  loadInterFont?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    toast: {
      position: ToastPosition
      maxToasts: number
      defaultTimeout: number
      theme: 'dark' | 'light'
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-toast-notification',
    configKey: 'toast',
    compatibility: {
      nuxt: '^3.13.0 || ^4.0.0',
    },
  },
  defaults: {
    position: 'bottom-right',
    maxToasts: 3,
    defaultTimeout: 5000,
    theme: 'dark',
    prefix: 'Toast',
    autoMount: true,
    loadShabnamFont: true,
    loadInterFont: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.toast = {
      position: options.position!,
      maxToasts: options.maxToasts!,
      defaultTimeout: options.defaultTimeout!,
      theme: options.theme!,
    }

    // Theme variables — must always be loaded so var(--toast-*) resolves.
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css.push(resolver.resolve('./runtime/assets/styles/toast-theme.css'))

    addComponent({
      name: `${options.prefix}Notification`,
      filePath: resolver.resolve('./runtime/components/ToastNotification.vue'),
    })
    addComponent({
      name: `${options.prefix}Container`,
      filePath: resolver.resolve('./runtime/components/ToastContainer.vue'),
    })

    addImports({
      name: 'useToast',
      from: resolver.resolve('./runtime/composables/useToast'),
    })

    if (options.loadShabnamFont) {
      nuxt.options.css.push(resolver.resolve('./runtime/assets/styles/toast-fonts.css'))
    }

    if (options.loadInterFont) {
      nuxt.options.app = nuxt.options.app || {}
      nuxt.options.app.head = nuxt.options.app.head || {}
      nuxt.options.app.head.link = nuxt.options.app.head.link || []
      nuxt.options.app.head.link.push(
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      )
    }

    if (options.autoMount) {
      addPlugin({
        src: resolver.resolve('./runtime/plugin.client'),
        mode: 'client',
      })
    }
  },
})
