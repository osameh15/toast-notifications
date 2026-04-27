import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ToastContainer from '../src/runtime/components/ToastContainer.vue'
import { useToast, _setToastConfig } from '../src/runtime/composables/useToast'

describe('ToastContainer', () => {
  beforeEach(() => {
    useToast().clear()
    _setToastConfig({ maxToasts: 3, defaultTimeout: 5000 })
  })

  it('renders no toasts initially', () => {
    const wrapper = mount(ToastContainer)
    expect(wrapper.findAll('.toast-card')).toHaveLength(0)
  })

  it('applies the default position class (bottom-right)', () => {
    const wrapper = mount(ToastContainer)
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
    const wrapper = mount(ToastContainer, { props: { position } })
    expect(wrapper.find('.toast-container').classes())
      .toContain(`toast-position-${position}`)
  })

  it('renders a toast that was pushed via useToast()', async () => {
    const { show } = useToast()
    show({ title: 'Hello', message: 'World', timeout: 0 })

    const wrapper = mount(ToastContainer)
    await flushPromises()

    expect(wrapper.findAll('.toast-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('renders multiple toasts in order', async () => {
    const { show } = useToast()
    show({ title: 'First', message: '1', timeout: 0 })
    show({ title: 'Second', message: '2', timeout: 0 })

    const wrapper = mount(ToastContainer)
    await flushPromises()

    const cards = wrapper.findAll('.toast-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('First')
    expect(cards[1].text()).toContain('Second')
  })

  it('removes a toast from state when its close button is clicked', async () => {
    const { show, toasts } = useToast()
    show({ title: 'A', message: 'B', timeout: 0 })

    const wrapper = mount(ToastContainer)
    await flushPromises()
    expect(toasts.value).toHaveLength(1)

    await wrapper.find('.toast-close-btn').trigger('click')
    await flushPromises()

    expect(toasts.value).toHaveLength(0)
  })

  it('reactively reflects new toasts added after mount', async () => {
    const wrapper = mount(ToastContainer)
    expect(wrapper.findAll('.toast-card')).toHaveLength(0)

    useToast().info('New', 'Toast', 0)
    await flushPromises()

    expect(wrapper.findAll('.toast-card')).toHaveLength(1)
  })
})
