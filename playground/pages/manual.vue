<template>
  <div class="demo">
    <header>
      <h1>Manual mount</h1>
      <p class="tagline">
        With <code>autoMount: false</code>, you place
        <code>&lt;ToastContainer /&gt;</code> yourself — at any position.
      </p>
      <nav>
        <NuxtLink to="/">Quick demo</NuxtLink>
        <NuxtLink to="/positions">Positions</NuxtLink>
        <NuxtLink to="/manual">Manual mount</NuxtLink>
      </nav>
    </header>

    <p class="hint">
      This page mounts an extra <code>&lt;ToastContainer position="top-center" /&gt;</code>
      directly in the template. Click below to trigger a toast — it will appear
      both in the auto-mounted bottom-right container <em>and</em> the manual
      top-center one (because both subscribe to the same toast state).
    </p>

    <button
      class="btn"
      @click="onTrigger"
    >
      Show toast
    </button>

    <ToastContainer position="top-center" />
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const onTrigger = () =>
  toast.success('Manual mount works', 'This toast is rendered by both containers.')
</script>

<style scoped>
.demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 760px;
  margin: 60px auto;
  padding: 24px;
  color: #1a1a1a;
}
header h1 { margin: 0 0 8px; font-size: 32px; }
header .tagline { margin: 0 0 16px; color: #555; }
header .tagline code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
nav {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
}
nav a { color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 500; }
nav a:hover { text-decoration: underline; }
nav a.router-link-exact-active { color: #1a1a1a; font-weight: 600; }

.hint {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #1e3a8a;
  line-height: 1.6;
}
.hint code {
  background: #dbeafe;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.btn {
  margin-top: 24px;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}
.btn:hover { background: #1d4ed8; }
</style>
