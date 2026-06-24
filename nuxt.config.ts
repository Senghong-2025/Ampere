import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: '',
    public: {
      TOKEN_KEY: import.meta.env.TOKEN_KEY || '',
      telegram: {
        TELEGRAM_BOT_TOKEN: '',
        TELEGRAM_CHAT_ID: ''
      }
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
          content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ]
    }
  },
})
