import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useToast, _setToastConfig } from '../src/runtime/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    useToast().clear()
    _setToastConfig({ maxToasts: 3, defaultTimeout: 5000 })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('show()', () => {
    it('returns a numeric id', () => {
      const { show } = useToast()
      const id = show({ title: 'A', message: 'B', timeout: 0 })
      expect(typeof id).toBe('number')
    })

    it('returns a unique id per call', () => {
      const { show } = useToast()
      const id1 = show({ title: '1', message: '1', timeout: 0 })
      const id2 = show({ title: '2', message: '2', timeout: 0 })
      expect(id1).not.toBe(id2)
    })

    it('adds a toast to the toasts ref', () => {
      const { show, toasts } = useToast()
      show({ title: 'Hello', message: 'World', timeout: 0 })
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].title).toBe('Hello')
      expect(toasts.value[0].message).toBe('World')
    })

    it('defaults type to info', () => {
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'B', timeout: 0 })
      expect(toasts.value[0].type).toBe('info')
    })

    it('maps "success" type to "healthy"', () => {
      const { show, toasts } = useToast()
      show({ type: 'success', title: 'A', message: 'B', timeout: 0 })
      expect(toasts.value[0].type).toBe('healthy')
    })

    it('respects maxToasts by dropping the oldest', () => {
      _setToastConfig({ maxToasts: 2 })
      const { show, toasts } = useToast()
      show({ title: '1', message: '1', timeout: 0 })
      show({ title: '2', message: '2', timeout: 0 })
      show({ title: '3', message: '3', timeout: 0 })

      expect(toasts.value).toHaveLength(2)
      expect(toasts.value.map(t => t.title)).toEqual(['2', '3'])
    })

    it('auto-removes after the given timeout', () => {
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'B', timeout: 1000 })
      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(999)
      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(toasts.value).toHaveLength(0)
    })

    it('does not auto-remove when timeout is 0', () => {
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'B', timeout: 0 })
      vi.advanceTimersByTime(60_000)
      expect(toasts.value).toHaveLength(1)
    })

    it('uses defaultTimeout when timeout is unspecified', () => {
      _setToastConfig({ defaultTimeout: 2000 })
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'B' })

      vi.advanceTimersByTime(1999)
      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('remove()', () => {
    it('removes a toast by id', () => {
      const { show, remove, toasts } = useToast()
      const id = show({ title: 'A', message: 'B', timeout: 0 })
      expect(toasts.value).toHaveLength(1)
      remove(id)
      expect(toasts.value).toHaveLength(0)
    })

    it('is a no-op for unknown ids', () => {
      const { show, remove, toasts } = useToast()
      show({ title: 'A', message: 'B', timeout: 0 })
      remove(999_999)
      expect(toasts.value).toHaveLength(1)
    })
  })

  describe('clear()', () => {
    it('removes all toasts', () => {
      const { show, clear, toasts } = useToast()
      show({ title: '1', message: '1', timeout: 0 })
      show({ title: '2', message: '2', timeout: 0 })
      show({ title: '3', message: '3', timeout: 0 })

      clear()
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('convenience methods', () => {
    it.each([
      ['success', 'healthy'],
      ['warning', 'warning'],
      ['error', 'error'],
      ['info', 'info'],
    ] as const)('%s() pushes a toast of type "%s"', (method, expectedType) => {
      const t = useToast()
      ;(t[method] as (a: string, b: string, c?: number) => number)('Title', 'Body', 0)
      expect(t.toasts.value).toHaveLength(1)
      expect(t.toasts.value[0].type).toBe(expectedType)
      expect(t.toasts.value[0].title).toBe('Title')
      expect(t.toasts.value[0].message).toBe('Body')
    })

    it('returns the toast id', () => {
      const id = useToast().success('A', 'B', 0)
      expect(typeof id).toBe('number')
    })
  })

  describe('_setToastConfig()', () => {
    it('updates maxToasts', () => {
      _setToastConfig({ maxToasts: 1 })
      const { show, toasts } = useToast()
      show({ title: '1', message: '1', timeout: 0 })
      show({ title: '2', message: '2', timeout: 0 })
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].title).toBe('2')
    })

    it('updates defaultTimeout', () => {
      _setToastConfig({ defaultTimeout: 100 })
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'B' })
      vi.advanceTimersByTime(100)
      expect(toasts.value).toHaveLength(0)
    })

    it('ignores undefined fields', () => {
      _setToastConfig({ maxToasts: 5 })
      _setToastConfig({ defaultTimeout: 1234 })
      _setToastConfig({})

      const { show, toasts } = useToast()
      for (let i = 0; i < 5; i++) show({ title: `${i}`, message: `${i}`, timeout: 0 })
      expect(toasts.value).toHaveLength(5)
    })
  })
})
