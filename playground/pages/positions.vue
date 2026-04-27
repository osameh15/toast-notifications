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
        ><rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
        /></svg>
      </span>
      Positions
    </h2>
    <p class="hint">
      Six positions are supported. Configure globally with
      <code>toast.position</code> in <code>nuxt.config.ts</code>, or pass the
      <code>position</code> prop to <code>&lt;ToastContainer /&gt;</code>.
    </p>
    <p class="warn-box">
      The auto-mounted container in this playground is fixed at
      <strong>bottom-right</strong>. To preview a different position visually,
      use the <NuxtLink to="/manual">Manual mount</NuxtLink> page.
    </p>
    <div class="grid cols-3">
      <button
        class="btn btn-outline"
        @click="trigger('top-right')"
      >
        top-right
      </button>
      <button
        class="btn btn-outline"
        @click="trigger('top-left')"
      >
        top-left
      </button>
      <button
        class="btn btn-outline"
        @click="trigger('top-center')"
      >
        top-center
      </button>
      <button
        class="btn btn-outline"
        @click="trigger('bottom-right')"
      >
        bottom-right
      </button>
      <button
        class="btn btn-outline"
        @click="trigger('bottom-left')"
      >
        bottom-left
      </button>
      <button
        class="btn btn-outline"
        @click="trigger('bottom-center')"
      >
        bottom-center
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const toast = useToast()

const trigger = (label: string) =>
  toast.info('Position label', `You picked: ${label}`)
</script>
