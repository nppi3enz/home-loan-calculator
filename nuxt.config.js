import colors from 'vuetify/es5/util/colors'

export default {
  target: 'static',
  router: {
    base: '/home-loan-calculator/'
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Home Loan Calculator',
    title: 'โปรแกรมคำนวณสินเชื่อบ้าน สินเชื่อคอนโด (Home Loan Calculator)',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', {treeShake: true}]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    ['v-currency-field/nuxt-treeshaking', {
      locale: 'en',
      decimalLength: 2,
      autoDecimalMode: false,
      min: 0,
      max: null,
      defaultValue: 0,
      valueAsInteger: true,
      allowNegative: false
    }]
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: false,
      themes: {
        // light: {
        //   primary: colors.purple,
        //   secondary: colors.grey.darken1,
        //   accent: colors.shades.black,
        //   error: colors.red.accent3,
        // },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
