export default defineNuxtConfig({
  modules: ['../src/module'],

  toast: {
    position: 'bottom-right',
    maxToasts: 3,
    defaultTimeout: 5000,
    autoMount: true,
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
})
