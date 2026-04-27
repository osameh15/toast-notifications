<template>
  <div class="demo">
    <header>
      <h1>nuxt-toast-notification</h1>
      <p class="tagline">
        A beautiful, framework-free toast notification module for Nuxt 3.
      </p>
      <nav>
        <NuxtLink to="/">Quick demo</NuxtLink>
        <NuxtLink to="/positions">Positions</NuxtLink>
        <NuxtLink to="/manual">Manual mount</NuxtLink>
      </nav>
    </header>

    <section>
      <h2>Convenience methods</h2>
      <p class="hint">
        <code>toast.success/warning/error/info(title, message, timeout?)</code>
      </p>
      <div class="grid">
        <button
          class="btn success"
          @click="onSuccess"
        >
          success()
        </button>
        <button
          class="btn warning"
          @click="onWarning"
        >
          warning()
        </button>
        <button
          class="btn error"
          @click="onError"
        >
          error()
        </button>
        <button
          class="btn info"
          @click="onInfo"
        >
          info()
        </button>
      </div>
    </section>

    <section>
      <h2>Custom <code>show()</code></h2>
      <p class="hint">
        <code>toast.show({ type, title, message, timeout })</code>
      </p>
      <div class="grid">
        <button
          class="btn"
          @click="onCustom"
        >
          10s timeout
        </button>
        <button
          class="btn"
          @click="onPersistent"
        >
          Persistent (timeout: 0)
        </button>
        <button
          class="btn"
          @click="onSpam"
        >
          Spam 5 toasts
        </button>
        <button
          class="btn danger-outline"
          @click="onClear"
        >
          Clear all
        </button>
      </div>
    </section>

    <section>
      <h2>Live state</h2>
      <p class="hint">
        Active toasts: <strong>{{ toasts.length }}</strong> /
        max {{ 3 }}
      </p>
    </section>
  </div>
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

<style scoped>
.demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 760px;
  margin: 60px auto;
  padding: 24px;
  color: #1a1a1a;
}

header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
}
header .tagline {
  margin: 0 0 16px;
  color: #555;
}
nav {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
}
nav a {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
nav a:hover { text-decoration: underline; }
nav a.router-link-exact-active { color: #1a1a1a; font-weight: 600; }

section { margin-top: 32px; }
section h2 { font-size: 18px; margin: 0 0 8px; color: #1a1a1a; }
.hint {
  margin: 0 0 16px;
  color: #666;
  font-size: 13px;
}
.hint code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.btn {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn:hover {
  background: #f5f5f5;
  border-color: #aaa;
}
.btn.success { background: #30e0a1; color: #fff; border-color: #30e0a1; }
.btn.warning { background: #ffd700; color: #1a1a1a; border-color: #ffd700; }
.btn.error   { background: #dc143c; color: #fff; border-color: #dc143c; }
.btn.info    { background: #00b8d9; color: #fff; border-color: #00b8d9; }
.btn.danger-outline { color: #dc143c; border-color: #dc143c; }
.btn.danger-outline:hover { background: #fef2f2; }
</style>
