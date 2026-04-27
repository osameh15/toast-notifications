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
})
