// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      TOKEN_KEY: process.env.TOKEN_KEY
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@element-plus/nuxt'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
   nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        }
      ]
    }
  },
})