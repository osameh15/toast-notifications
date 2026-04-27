<template>
  <div class="demo">
    <header>
      <h1>Positions</h1>
      <p class="tagline">
        Six positions are supported. Set globally via
        <code>toast.position</code> in <code>nuxt.config.ts</code>, or per
        container via the <code>position</code> prop.
      </p>
      <nav>
        <NuxtLink to="/">Quick demo</NuxtLink>
        <NuxtLink to="/test">Test page</NuxtLink>
        <NuxtLink to="/positions">Positions</NuxtLink>
        <NuxtLink to="/manual">Manual mount</NuxtLink>
      </nav>
    </header>

    <p class="warn">
      Note: the auto-mounted container in this playground uses
      <strong>bottom-right</strong>. To preview a different position visually,
      use the <NuxtLink to="/manual">Manual mount</NuxtLink> page.
    </p>

    <section>
      <h2>Trigger a toast (will appear bottom-right here)</h2>
      <div class="grid">
        <button
          class="btn"
          @click="trigger('top-right')"
        >
          top-right
        </button>
        <button
          class="btn"
          @click="trigger('top-left')"
        >
          top-left
        </button>
        <button
          class="btn"
          @click="trigger('top-center')"
        >
          top-center
        </button>
        <button
          class="btn"
          @click="trigger('bottom-right')"
        >
          bottom-right
        </button>
        <button
          class="btn"
          @click="trigger('bottom-left')"
        >
          bottom-left
        </button>
        <button
          class="btn"
          @click="trigger('bottom-center')"
        >
          bottom-center
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const trigger = (label: string) =>
  toast.info('Position label', `You picked: ${label}`)
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
nav a {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
nav a:hover { text-decoration: underline; }
nav a.router-link-exact-active { color: #1a1a1a; font-weight: 600; }

.warn {
  background: #fef9c3;
  border-left: 4px solid #ca8a04;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #713f12;
}
.warn a { color: #713f12; }

section { margin-top: 32px; }
section h2 { font-size: 18px; margin: 0 0 16px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
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
.btn:hover { background: #f5f5f5; border-color: #aaa; }
</style>
