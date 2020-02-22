module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Source Code | An open source library for computer science',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {name: 'theme-color', content: '#2974fa'},
      {name: 'msapplication-TileColor', content: '#2974fa'},
      {property: 'og:site_name', content: 'Source Code'},
      {property: 'og:image', content: ''},
      {property: 'og:type', content: 'website'},
      {property: 'twitter:card', content: 'summary_large_image'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:200,400,700&Source+Code+Pro&display=swap'
      }
    ],
    script: [
      {src: 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver', body: true}
    ]
  },
  axios: {
    proxy: true
  },
  proxy: {
    '/api/': {target: undefined},
    '/auth/': {target: undefined}
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: 'auth/login', method: 'post', propertyName: 'token'},
          user: {url: 'auth/me', method: 'get', propertyName: false},
          logout: false
        }
      }
    },
    redirect: {
      home: '/',
      callback: false,
      logout: '/'
    }
  },
  moment: {
    defaultLocale: 'fr',
    locales: ['fr']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/Loading.vue',
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/app.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/notifications',
    '~/plugins/validator'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    '@nuxtjs/moment'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [
      "vee-validate/dist/rules",
      "/nuxt-typed-vuex/"
    ]
  }
};
