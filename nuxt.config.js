export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Workload Audit Tool',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/style.css', '@/assets/css/tailwind.less'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~plugins/form', '~plugins/filters'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    '@nuxtjs/toast',
    'nuxt-sweetalert2',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'https://uat-api.workloadaudit.com/public/api/admin/v1',
    // baseURL: 'http://127.0.0.1:8000/api/admin/v1',
    withCredentials: true,
  },

  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/',
    },
    strategies: {
      local: {
        grantType: 'password',
        token: {
          property: 'access_token',
          maxAge: 60,
          // required: true,
          type: 'Bearer',
        },
        user: {
          property: 'data',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'access_token',
          },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/profile', method: 'get' },
        },
      },
    },
  },

  router: {
    middleware: ['auth', 'password'],
  },

  toast: {
    position: 'bottom-left',
    duration: 10000,
    theme: 'bubble',
  },

  vuetify: {
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#E46805',
          background: '#13171c',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/lib', 'defu'],
  },
}
