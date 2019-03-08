/* **
  Nuxt.js 的配置文件,可以通过针对一系列参数的设置来完成 Nuxt.js 项目的配置,
  可以在Nuxt.js 官网 找到针对这个文件的说明
  */

const webpack = require('webpack')
module.exports = {
  /* 该配置项用于配置应用的源码目录路径 */
  srcDir: 'client/',
  /* 该配置项用于配置应用的打包后路径 */
  buildDir: 'dist/client/',
  /* 该配置项用于配置 Nuxt.js 应用的根目录 */
  rootDir: './',
  /* 该配置项用于配置 Nuxt.js 应用是开发还是生产模式 */
  dev: (process.env.NODE_ENV !== 'production'),
  /* 该配置项可用于覆盖 Nuxt.js 默认的 vue-router 配置 */
  router: {
    /* 在每页渲染前运行 middleware/check-auth.js 中间件的逻辑 */
    middleware: ['check-auth']
  },
  /* 该配置项用于配置应用默认的meta标签 */
  head: {
    title: 'GODSERVER 2.0',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /* 配置 Nuxt.js 项目的构建规则，即 Webpack 的构建配置 */
  build: {
    /* Nuxt.js允许将dist文件上传到CDN来获得最快渲染性能，只需将publicPath设置为CDN即可 */
    publicPath: '/hero/',
    /* 为 JS 和 Vue 文件设定自定义的 babel 配置  */
    babel: {
      plugins: ['transform-decorators-legacy', 'transform-class-properties']
    },
    /**
     * 为客户端和服务端的构建配置进行手工的扩展处理
     * 该扩展方法会被调用两次,一次在服务端打包构建的时候,另外一次是在客户端打包构建的时候
     **/
    extend (config, { isDev }) {
      config.resolve.alias['class-component'] = '@/plugins/class-component'
    },
    /**
     * Nuxt.js 允许你在自动生成的 vendor.bundle.js 文件中添加一些模块,以减少应用 bundle 的体积。
     * 这里说的是一些你所依赖的第三方模块
     * (在Nuxt.js 2.0+版本中,vendor由于Webpack 4,将废弃该API但保留使用方法作为兼容低版本处理)
     */
    vendor: [
      'axios',
      'element-ui',
      'negotiator',
      'vue-class-component',
      'vuex-class',
      'vue-i18n',
      'vue-chartjs',
      'vue-clipboards',
      'moment',
      'chart.js',
      'deepmerge' // vue-chartjs dep
    ],
    /* 使用Vue 服务器端渲染指南启用常见CSS提取 */
    extractCSS: true,
    /* 自定义打包文件名 */
    filenames: {
      // app: ({ isDev }) => isDev ? '[name].js' : 'goce.[chunkhash].js',
      // chunk: ({ isDev }) => isDev ? '[name].js' : 'goce.[chunkhash].js',
      // css: ({ isDev }) => isDev ? '[name].css' : 'goce.[contenthash].css',
      // img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[hash:7].[ext]',
      // font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[hash:7].[ext]',
      // video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[hash:7].[ext]',
      vendor: 'vendor.[hash:12].js',
      app: 'hero.[chunkhash:12].js',
      css: 'hero.[contenthash:12].css'
    },
    plugins: [
      /* 配置 Webpack 插件 */
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh|en|fr/)
    ]
  },
  /* 该配置项用于个性化定制 Nuxt.js 使用的加载组件  */
  loading: {
    color: '#60bbff'
  },
  /* 该配置项用于定义每个动态路由的参数，Nuxt.js 依据这些路由配置生成对应目录结构的静态文件 */
  generate: {
    dir: '.generated'
  },
  /* 该配置项用于定义应用的全局(所有页面均需引用的)样式文件、模块或第三方库 */
  css: [
    'normalize.css/normalize.css',
    'element-ui/lib/theme-chalk/index.css',
    { src: '@/assets/styles/main.scss', lang: 'scss' }
  ],
  /* 该配置项用于配置那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件 */
  plugins: [
    '@/plugins/i18n',
    '@/plugins/element-ui',
    { src: '@/plugins/clipboard', ssr: false },
    { src: '@/plugins/error-handler', ssr: false }
  ],
  /* 该配置项允许您将Nuxt模块添加到项目中 */
  modules: [
    '@nuxtjs/webpackmonitor', /* Webpack监视器 */
    '@nuxtjs/axios'
  ],
  // koa-proxies for dev, options reference https://github.com/nodejitsu/node-http-proxy#options
  development: {
    proxies: [
      /* {
        path: '/hpi/',
        target: 'http://localhost:7777/',
        logs: true,
        prependPath: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pages(\/|\/\w+)?$/, '/service')
      } */
    ]
  }
}
