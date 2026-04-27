<template>
  <div class="page-dark">
    <div class="container">
      <header class="test-card">
        <h1>nuxt-toast-notification</h1>
        <p class="subtitle">
          A modern Nuxt 3 / 4 toast module — bundled fonts, six positions, full TypeScript.
        </p>
        <nav class="page-nav">
          <NuxtLink to="/">Quick demo</NuxtLink>
          <NuxtLink to="/test">Test page</NuxtLink>
          <NuxtLink to="/positions">Positions</NuxtLink>
          <NuxtLink to="/manual">Manual mount</NuxtLink>
        </nav>
      </header>

      <slot />
    </div>
  </div>
</template>
