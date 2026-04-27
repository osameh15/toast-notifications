import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastNotification from '../src/runtime/components/ToastNotification.vue'

describe('ToastNotification', () => {
  it('renders title and message when modelValue is true', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'Hello', message: 'World' },
    })
    expect(wrapper.find('.toast-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('does not render the card when modelValue is false', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: false, title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-card').exists()).toBe(false)
  })

  it.each([
    ['healthy', 'toast-healthy'],
    ['warning', 'toast-warning'],
    ['error', 'toast-error'],
    ['info', 'toast-info'],
  ] as const)('applies "%s" class for type "%s"', (type, className) => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, type, title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-card').classes()).toContain(className)
  })

  it('maps the "success" type to the "healthy" CSS class', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, type: 'success', title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-card').classes()).toContain('toast-healthy')
  })

  it('renders an icon SVG', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, type: 'info', title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-icon svg').exists()).toBe(true)
  })

  it('renders a close button with aria-label', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'A', message: 'B' },
    })
    const btn = wrapper.find('.toast-close-btn')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-label')).toBeDefined()
  })

  it('emits update:modelValue=false when close button is clicked', async () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'A', message: 'B' },
    })
    await wrapper.find('.toast-close-btn').trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual([false])
  })

  it('reflects external modelValue changes', async () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-card').exists()).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.toast-card').exists()).toBe(false)
  })

  it('exposes a close() method', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'A', message: 'B' },
    })
    expect(typeof (wrapper.vm as unknown as { close: () => void }).close).toBe('function')
  })

  it('has role="alert" for accessibility', () => {
    const wrapper = mount(ToastNotification, {
      props: { modelValue: true, title: 'A', message: 'B' },
    })
    expect(wrapper.find('.toast-card').attributes('role')).toBe('alert')
  })

  describe('direction (RTL auto-detection)', () => {
    it('uses dir="ltr" for Latin text', () => {
      const wrapper = mount(ToastNotification, {
        props: { modelValue: true, title: 'Saved', message: 'Your changes are saved.' },
      })
      expect(wrapper.find('.toast-card').attributes('dir')).toBe('ltr')
    })

    it('switches to dir="rtl" when title contains Persian script', () => {
      const wrapper = mount(ToastNotification, {
        props: { modelValue: true, title: 'عملیات موفق', message: 'Saved.' },
      })
      expect(wrapper.find('.toast-card').attributes('dir')).toBe('rtl')
    })

    it('switches to dir="rtl" when message contains Arabic script', () => {
      const wrapper = mount(ToastNotification, {
        props: { modelValue: true, title: 'Saved', message: 'تم الحفظ بنجاح' },
      })
      expect(wrapper.find('.toast-card').attributes('dir')).toBe('rtl')
    })
  })
})
