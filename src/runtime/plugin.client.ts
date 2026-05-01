import { createApp, h } from 'vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import ToastContainer from './components/ToastContainer.vue'
import { _setToastConfig, _setToastTheme } from './composables/useToast'

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public.toast as {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    maxToasts: number
    defaultTimeout: number
    theme: 'dark' | 'light'
  }

  _setToastConfig({
    maxToasts: cfg.maxToasts,
    defaultTimeout: cfg.defaultTimeout,
  })
  _setToastTheme(cfg.theme)

  const root = document.createElement('div')
  root.id = 'nuxt-toast-notification-root'
  document.body.appendChild(root)

  const app = createApp({
    render: () => h(ToastContainer, { position: cfg.position }),
  })
  app.mount(root)
})
