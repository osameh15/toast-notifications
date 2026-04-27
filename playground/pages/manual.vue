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
        ><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
      </span>
      Manual mount
    </h2>
    <p class="hint">
      With <code>autoMount: false</code>, you place
      <code>&lt;ToastContainer /&gt;</code> yourself — at any position.
    </p>
    <p class="warn-box">
      This page mounts an extra <code>&lt;ToastContainer position="top-center" /&gt;</code>
      directly in the template. Click below to trigger a toast — it appears
      both in the auto-mounted bottom-right container <em>and</em> the manual
      top-center one (because both subscribe to the same toast state).
    </p>
    <button
      class="btn btn-tonal-primary"
      @click="onTrigger"
    >
      Show toast
    </button>

    <ToastContainer position="top-center" />
  </section>
</template>

<script setup lang="ts">
const toast = useToast()
const onTrigger = () =>
  toast.success('Manual mount works', 'This toast is rendered by both containers.')
</script>
