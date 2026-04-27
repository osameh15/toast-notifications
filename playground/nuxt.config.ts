export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',

  toast: {
    position: 'bottom-right',
    maxToasts: 3,
    defaultTimeout: 5000,
    autoMount: true,
  },
})
