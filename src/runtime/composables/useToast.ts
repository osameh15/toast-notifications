import { ref } from 'vue'

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

interface ToastConfig {
  maxToasts: number
  defaultTimeout: number
}

const toasts = ref<ToastInstance[]>([])
let nextId = 0

const config: ToastConfig = {
  maxToasts: 3,
  defaultTimeout: 5000,
}

/** Internal: invoked by the auto-mount plugin to apply user module options. */
export const _setToastConfig = (next: Partial<ToastConfig>): void => {
  if (typeof next.maxToasts === 'number') config.maxToasts = next.maxToasts
  if (typeof next.defaultTimeout === 'number') config.defaultTimeout = next.defaultTimeout
}

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

  return {
    toasts,
    show,
    remove,
    clear,
    success,
    warning,
    error,
    info,
  }
}
