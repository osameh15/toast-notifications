import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ToastContainer from '../src/runtime/components/ToastContainer.vue'
import { useToast, _setToastConfig } from '../src/runtime/composables/useToast'

// Disable Teleport in tests so the rendered DOM stays inside the wrapper
// (production behavior teleports the container into <body> to escape any
// ancestor that creates a containing block via backdrop-filter / transform).
const mountContainer = (props: Record<string, unknown> = {}) =>
  mount(ToastContainer, { props: { teleport: false, ...props } })

describe('ToastContainer', () => {
  beforeEach(() => {
    useToast().clear()
    _setToastConfig({ maxToasts: 3, defaultTimeout: 5000 })
  })

  it('renders no toasts initially', () => {
    const wrapper = mountContainer()
    expect(wrapper.findAll('.toast-card')).toHaveLength(0)
  })

  it('applies the default position class (bottom-right)', () => {
    const wrapper = mountContainer()
    expect(wrapper.find('.toast-container').classes())
      .toContain('toast-position-bottom-right')
  })

  it.each([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const)('applies the "toast-position-%s" class', (position) => {
    const wrapper = mountContainer({ position })
    expect(wrapper.find('.toast-container').classes())
      .toContain(`toast-position-${position}`)
  })

  it('renders a toast that was pushed via useToast()', async () => {
    const { show } = useToast()
    show({ title: 'Hello', message: 'World', timeout: 0 })

    const wrapper = mountContainer()
    await flushPromises()

    expect(wrapper.findAll('.toast-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('renders multiple toasts in order', async () => {
    const { show } = useToast()
    show({ title: 'First', message: '1', timeout: 0 })
    show({ title: 'Second', message: '2', timeout: 0 })

    const wrapper = mountContainer()
    await flushPromises()

    const cards = wrapper.findAll('.toast-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('First')
    expect(cards[1].text()).toContain('Second')
  })

  it('removes a toast from state when its close button is clicked', async () => {
    const { show, toasts } = useToast()
    show({ title: 'A', message: 'B', timeout: 0 })

    const wrapper = mountContainer()
    await flushPromises()
    expect(toasts.value).toHaveLength(1)

    await wrapper.find('.toast-close-btn').trigger('click')
    await flushPromises()

    expect(toasts.value).toHaveLength(0)
  })

  it('reactively reflects new toasts added after mount', async () => {
    const wrapper = mountContainer()
    expect(wrapper.findAll('.toast-card')).toHaveLength(0)

    useToast().info('New', 'Toast', 0)
    await flushPromises()

    expect(wrapper.findAll('.toast-card')).toHaveLength(1)
  })

  describe('theme', () => {
    it('applies data-theme="dark" by default', () => {
      const { setTheme } = useToast()
      setTheme('dark')
      const wrapper = mountContainer()
      expect(wrapper.find('.toast-container').attributes('data-theme')).toBe('dark')
    })

    it('reflects setTheme(\'light\') from the composable', async () => {
      const { setTheme } = useToast()
      setTheme('dark')
      const wrapper = mountContainer()
      expect(wrapper.find('.toast-container').attributes('data-theme')).toBe('dark')

      setTheme('light')
      await flushPromises()
      expect(wrapper.find('.toast-container').attributes('data-theme')).toBe('light')

      setTheme('dark') // restore
    })

    it('container "theme" prop overrides the composable theme', () => {
      const { setTheme } = useToast()
      setTheme('dark')
      const wrapper = mountContainer({ theme: 'light' })
      expect(wrapper.find('.toast-container').attributes('data-theme')).toBe('light')
    })
  })

  it('teleports to document.body by default', async () => {
    const { show } = useToast()
    show({ title: 'Teleported', message: 'Hi', timeout: 0 })

    const wrapper = mount(ToastContainer)
    await flushPromises()

    // With teleport active, the container lives in body, not in the wrapper
    expect(wrapper.find('.toast-container').exists()).toBe(false)
    expect(document.body.querySelector('.toast-container')).not.toBeNull()
    expect(document.body.querySelector('.toast-card')?.textContent)
      .toContain('Teleported')

    wrapper.unmount()
  })

  describe('Hide all button', () => {
    it('does not render with 0 toasts', () => {
      const wrapper = mountContainer()
      expect(wrapper.find('.hide-all-btn').exists()).toBe(false)
    })

    it('does not render with exactly 1 toast', async () => {
      const { show } = useToast()
      show({ title: 'Only one', message: '...', timeout: 0 })

      const wrapper = mountContainer()
      await flushPromises()

      expect(wrapper.findAll('.toast-card')).toHaveLength(1)
      expect(wrapper.find('.hide-all-btn').exists()).toBe(false)
    })

    it('renders when 2 or more toasts are visible', async () => {
      const { show } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })

      const wrapper = mountContainer()
      await flushPromises()

      expect(wrapper.find('.hide-all-btn').exists()).toBe(true)
    })

    it('uses the default label "Hide all"', async () => {
      const { show } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })

      const wrapper = mountContainer()
      await flushPromises()

      expect(wrapper.find('.hide-all-btn').text()).toContain('Hide all')
    })

    it('respects a custom hideAllLabel prop', async () => {
      const { show } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })

      const wrapper = mountContainer({ hideAllLabel: 'پاک کردن همه' })
      await flushPromises()

      expect(wrapper.find('.hide-all-btn').text()).toContain('پاک کردن همه')
    })

    it('clears all toasts when clicked', async () => {
      const { show, toasts } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })
      show({ title: 'C', message: 'c', timeout: 0 })

      const wrapper = mountContainer()
      await flushPromises()
      expect(toasts.value).toHaveLength(3)

      await wrapper.find('.hide-all-btn').trigger('click')
      await flushPromises()

      expect(toasts.value).toHaveLength(0)
      expect(wrapper.find('.hide-all-btn').exists()).toBe(false)
    })

    it('disappears when toast count drops below 2 via individual close', async () => {
      const { show } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })

      const wrapper = mountContainer()
      await flushPromises()
      expect(wrapper.find('.hide-all-btn').exists()).toBe(true)

      // Close one toast individually
      await wrapper.findAll('.toast-close-btn')[0].trigger('click')
      await flushPromises()

      expect(wrapper.find('.hide-all-btn').exists()).toBe(false)
    })

    it('can be hidden entirely via showHideAllButton: false', async () => {
      const { show } = useToast()
      show({ title: 'A', message: 'a', timeout: 0 })
      show({ title: 'B', message: 'b', timeout: 0 })
      show({ title: 'C', message: 'c', timeout: 0 })

      const wrapper = mountContainer({ showHideAllButton: false })
      await flushPromises()

      expect(wrapper.find('.hide-all-btn').exists()).toBe(false)
    })
  })
})
