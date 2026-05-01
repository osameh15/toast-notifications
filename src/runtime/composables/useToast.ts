import { ref, reactive, readonly } from 'vue'
import type { DeepReadonly } from 'vue'

export type ToastType = 'success' | 'healthy' | 'warning' | 'error' | 'info'

export interface ToastOptions {
  type?: ToastType
  title: string
  message: string
  /** Auto-dismiss timeout in ms. Pass `0` to keep the toast until dismissed manually. */
  timeout?: number
}

export interface ToastInstance {
  id: number
  type: Exclude<ToastType, 'success'>
  title: string
  message: string
  timeout: number
  visible: boolean
}

export interface ToastConfig {
  maxToasts: number
  defaultTimeout: number
}

export type ToastTheme = 'dark' | 'light'

const toasts = ref<ToastInstance[]>([])
let nextId = 0

const config = reactive<ToastConfig>({
  maxToasts: 3,
  defaultTimeout: 5000,
})

const theme = ref<ToastTheme>('dark')

/**
 * Update one or more runtime settings. Reactive — anywhere `config` is read
 * (templates, computed) re-runs on change.
 *
 * If `maxToasts` is decreased below the current visible count, the oldest
 * toasts are dropped immediately so the visible stack always satisfies the
 * new limit.
 */
const setConfig = (next: Partial<ToastConfig>): void => {
  if (typeof next.maxToasts === 'number') {
    config.maxToasts = next.maxToasts
    while (toasts.value.length > config.maxToasts) {
      toasts.value.shift()
    }
  }
  if (typeof next.defaultTimeout === 'number') {
    config.defaultTimeout = next.defaultTimeout
  }
}

/** @deprecated Use `useToast().setConfig(...)` instead. Kept for the auto-mount plugin. */
export const _setToastConfig = setConfig

/** Switch the global toast theme. Reactive — every container re-renders. */
const setTheme = (next: ToastTheme): void => {
  theme.value = next
}

/** Internal: invoked by the auto-mount plugin to seed the theme from module options. */
export const _setToastTheme = setTheme

export const useToast = () => {
  const show = ({ type = 'info', title, message, timeout }: ToastOptions): number => {
    while (toasts.value.length >= config.maxToasts) {
      toasts.value.shift()
    }

    const id = nextId++
    const t = typeof timeout === 'number' ? timeout : config.defaultTimeout
    const normalized = type === 'success' ? 'healthy' : type

    toasts.value.push({
      id,
      type: normalized,
      title,
      message,
      timeout: t,
      visible: true,
    })

    if (t > 0) {
      setTimeout(() => remove(id), t)
    }

    return id
  }

  const remove = (id: number): void => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const clear = (): void => {
    toasts.value = []
  }

  const success = (title: string, message: string, timeout?: number) =>
    show({ type: 'healthy', title, message, timeout })
  const warning = (title: string, message: string, timeout?: number) =>
    show({ type: 'warning', title, message, timeout })
  const error = (title: string, message: string, timeout?: number) =>
    show({ type: 'error', title, message, timeout })
  const info = (title: string, message: string, timeout?: number) =>
    show({ type: 'info', title, message, timeout })

  const readonlyConfig: DeepReadonly<ToastConfig> = readonly(config)

  return {
    toasts,
    show,
    remove,
    clear,
    success,
    warning,
    error,
    info,
    /** Read-only reactive view of the current runtime config. */
    config: readonlyConfig,
    /** Update runtime config. Trims excess toasts when `maxToasts` decreases. */
    setConfig,
    /** Reactive global theme — `'dark'` or `'light'`. Read-only. */
    theme: readonly(theme),
    /** Switch theme at runtime. All containers reactively pick up the change. */
    setTheme,
  }
}
