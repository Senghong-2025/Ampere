// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@element-plus/nuxt'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})