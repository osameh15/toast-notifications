<template>
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
      </span>
      Convenience methods
    </h2>
    <p class="hint">
      <code>toast.success / warning / error / info(title, message, timeout?)</code>
    </p>
    <div class="grid cols-4">
      <button
        class="btn btn-success"
        @click="onSuccess"
      >
        success()
      </button>
      <button
        class="btn btn-warning"
        @click="onWarning"
      >
        warning()
      </button>
      <button
        class="btn btn-error"
        @click="onError"
      >
        error()
      </button>
      <button
        class="btn btn-info"
        @click="onInfo"
      >
        info()
      </button>
    </div>
  </section>

  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      </span>
      Custom <code>show()</code>
    </h2>
    <p class="hint">
      <code>toast.show({ type, title, message, timeout })</code>
    </p>
    <div class="grid cols-4">
      <button
        class="btn btn-outline"
        @click="onCustom"
      >
        10s timeout
      </button>
      <button
        class="btn btn-outline"
        @click="onPersistent"
      >
        Persistent (timeout: 0)
      </button>
      <button
        class="btn btn-tonal"
        @click="onSpam"
      >
        Spam 5 toasts
      </button>
      <button
        class="btn btn-tonal-danger"
        @click="onClear"
      >
        Clear all
      </button>
    </div>
  </section>

  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
      </span>
      Max toasts
    </h2>
    <p class="hint">
      Change how many toasts can be visible at once. Older ones drop off
      when the limit is exceeded. Calls
      <code>useToast().setConfig({ maxToasts })</code>.
    </p>
    <div class="max-control">
      <button
        class="btn btn-tonal max-step"
        :disabled="config.maxToasts <= 1"
        aria-label="Decrease max toasts"
        @click="dec"
      >
        −
      </button>
      <input
        v-model.number="maxInput"
        type="number"
        min="1"
        max="10"
        class="field-input max-value"
        aria-label="Max toasts"
      >
      <button
        class="btn btn-tonal max-step"
        :disabled="config.maxToasts >= 10"
        aria-label="Increase max toasts"
        @click="inc"
      >
        +
      </button>
      <span class="max-current">
        Current max: <code>{{ config.maxToasts }}</code>
      </span>
    </div>
  </section>

  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><circle
          cx="12"
          cy="12"
          r="10"
        /><line
          x1="12"
          y1="8"
          x2="12"
          y2="12"
        /><line
          x1="12"
          y1="16"
          x2="12.01"
          y2="16"
        /></svg>
      </span>
      Live state
    </h2>
    <p class="hint">
      Active toasts: <code>{{ toasts.length }}</code> /
      max <code>{{ config.maxToasts }}</code>
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const toast = useToast()
const { toasts, config, setConfig } = toast

const maxInput = ref(config.maxToasts)

watch(maxInput, (raw) => {
  if (typeof raw !== 'number' || Number.isNaN(raw)) return
  const clamped = Math.max(1, Math.min(10, Math.round(raw)))
  if (clamped !== config.maxToasts) setConfig({ maxToasts: clamped })
  if (clamped !== raw) maxInput.value = clamped
})

watch(() => config.maxToasts, (v) => {
  if (maxInput.value !== v) maxInput.value = v
})

const inc = () => {
  if (config.maxToasts < 10) maxInput.value = config.maxToasts + 1
}
const dec = () => {
  if (config.maxToasts > 1) maxInput.value = config.maxToasts - 1
}

const onSuccess = () =>
  toast.success('Saved successfully', 'Your changes have been saved.')
const onWarning = () =>
  toast.warning('Heads up', 'Disk usage is above 85%.')
const onError = () =>
  toast.error('Operation failed', 'Could not connect to the server. Please try again.')
const onInfo = () =>
  toast.info('New version available', 'A newer version of the app is ready.')

const onCustom = () =>
  toast.show({
    type: 'info',
    title: 'Long-running notice',
    message: 'This toast stays visible for 10 seconds.',
    timeout: 10000,
  })

const onPersistent = () =>
  toast.show({
    type: 'warning',
    title: 'Action required',
    message: 'This toast stays open until you close it manually.',
    timeout: 0,
  })

let counter = 0
const onSpam = async () => {
  for (let i = 0; i < 5; i++) {
    toast.info(`Toast #${++counter}`, `This is spam toast ${i + 1} of 5.`)
    await new Promise(r => setTimeout(r, 200))
  }
}

const onClear = () => toast.clear()
</script>

<style scoped>
.max-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.max-step {
  width: 44px;
  height: 44px;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
}

.max-step:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.max-value {
  width: 80px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  font-size: 16px;
  font-weight: 600;
}

.max-current {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin-left: auto;
}
</style>
