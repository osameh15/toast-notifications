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
      max <code>3</code>
    </p>
  </section>
</template>

<script setup lang="ts">
const toast = useToast()
const { toasts } = toast

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
