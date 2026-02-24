// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // App Configuration
  app: {
    head: {
      title: 'SyncHorizon - Global Timezone Converter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Convert timezones with daylight savings awareness' },
        { name: 'theme-color', content: '#3b82f6' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  // CSS - Import global styles
  css: ['assets/styles/main.css'],

  // Modules
  modules: [],

  // Nitro Configuration
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml'],
    },
  },
})
