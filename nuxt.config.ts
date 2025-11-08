import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  runtimeConfig: {
    public: {
      // NUXT_PUBLIC_API_BASE
      apiBase: 'http://192.168.1.181:10501/api',
    },
  },
  routeRules: {
    '/': { prerender: true },
  },
  imports: {
    dirs: ['~/lib'],
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
    ],
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
  ],
  icon: {
    mode: 'svg',
    size: '1.5rem',
    serverBundle: {
      collections: ['lucide'],
    },
    localApiEndpoint: '/_nuxt_icon',
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  piniaPluginPersistedstate: {
    cookieOptions: {
      maxAge: 2592000,
    },
  },
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
})
