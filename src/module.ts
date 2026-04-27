import {
  defineNuxtModule,
  addComponent,
  addImports,
  addPlugin,
  createResolver,
} from '@nuxt/kit'

export type ToastPosition =
  | 'top-right'
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
  /** Component name prefix. Defaults to `Toast` (so components are `<ToastNotification>` and `<ToastContainer>`). */
  prefix?: string
  /**
   * If true, a `<ToastContainer>` is mounted automatically on the client and
   * you only need to call `useToast()`. If false, mount `<ToastContainer />`
   * yourself somewhere in your app (e.g. `app.vue`). Defaults to `true`.
   */
  autoMount?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    toast: {
      position: ToastPosition
      maxToasts: number
      defaultTimeout: number
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-toast-notification',
    configKey: 'toast',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    position: 'bottom-right',
    maxToasts: 3,
    defaultTimeout: 5000,
    prefix: 'Toast',
    autoMount: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.toast = {
      position: options.position!,
      maxToasts: options.maxToasts!,
      defaultTimeout: options.defaultTimeout!,
    }

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

    if (options.autoMount) {
      addPlugin({
        src: resolver.resolve('./runtime/plugin.client'),
        mode: 'client',
      })
    }
  },
})
