<template>
  <transition name="toast-slide">
    <div
      v-if="isVisible"
      :class="['toast-card', `toast-${normalizedType}`]"
      role="alert"
      aria-live="polite"
    >
      <button
        type="button"
        class="toast-close-btn"
        aria-label="Close notification"
        @click="close"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          />
        </svg>
      </button>

      <div class="toast-header">
        <span
          class="toast-icon"
          :style="{ color: iconColor }"
        >
          <component :is="iconComponent" />
        </span>
        <h3 class="toast-title">
          {{ title }}
        </h3>
      </div>

      <div class="toast-body">
        <p class="toast-message">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import type { FunctionalComponent } from 'vue'

type PropType = 'success' | 'healthy' | 'warning' | 'error' | 'info'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    type?: PropType
    title: string
    message: string
    timeout?: number
  }>(),
  {
    modelValue: false,
    type: 'info',
    timeout: 5000,
  },
)

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const isVisible = ref(props.modelValue)

watch(() => props.modelValue, (v) => {
  isVisible.value = v
})
watch(isVisible, v => emit('update:modelValue', v))

const normalizedType = computed<Exclude<PropType, 'success'>>(() =>
  props.type === 'success' ? 'healthy' : props.type,
)

const iconColor = computed(() => ({
  healthy: '#30e0a1',
  warning: '#FFD700',
  error: '#DC143C',
  info: '#00FFFF',
}[normalizedType.value]))

const svgAttrs = {
  'width': 32,
  'height': 32,
  'viewBox': '0 0 24 24',
  'fill': 'none',
  'stroke': 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
}

const CheckCircle: FunctionalComponent = () =>
  h('svg', svgAttrs, [
    h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
    h('polyline', { points: '22 4 12 14.01 9 11.01' }),
  ])

const Alert: FunctionalComponent = () =>
  h('svg', svgAttrs, [
    h('path', {
      d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    }),
    h('line', { x1: 12, y1: 9, x2: 12, y2: 13 }),
    h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
  ])

const AlertCircle: FunctionalComponent = () =>
  h('svg', svgAttrs, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
    h('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
  ])

const InfoIcon: FunctionalComponent = () =>
  h('svg', svgAttrs, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('line', { x1: 12, y1: 16, x2: 12, y2: 12 }),
    h('line', { x1: 12, y1: 8, x2: 12.01, y2: 8 }),
  ])

const iconComponent = computed(() => ({
  healthy: CheckCircle,
  warning: Alert,
  error: AlertCircle,
  info: InfoIcon,
}[normalizedType.value]))

const close = (): void => {
  isVisible.value = false
}

defineExpose({ close })
</script>

<style scoped>
.toast-slide-enter-active {
  transition: all 0.3s ease-out;
}
.toast-slide-leave-active {
  transition: all 0.3s ease-in;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-card {
  position: relative;
  min-width: 350px;
  max-width: 450px;
  padding: 24px;
  background: radial-gradient(
    120% 104.06% at 50.07% -4%,
    rgba(51, 78, 104, 0.95) 1.9%,
    rgba(25, 29, 35, 0.95) 100%
  );
  -webkit-backdrop-filter: blur(12.5px);
  backdrop-filter: blur(12.5px);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  font-family: 'Shabnam', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  box-sizing: border-box;
}

.toast-healthy { border: 2px solid #30e0a1; }
.toast-warning { border: 2px solid #ffd700; }
.toast-error   { border: 2px solid #dc143c; }
.toast-info    { border: 2px solid #00ffff; }

.toast-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
  transition: background-color 0.2s ease;
}
.toast-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.toast-close-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 2px;
}

.toast-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 12px;
  line-height: 0;
}

.toast-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: white;
  text-align: center;
  font-family: inherit;
}

.toast-body {
  display: flex;
  justify-content: center;
}

.toast-message {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-family: inherit;
}
</style>
