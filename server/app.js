/* 导入koa,koa2中导入的是一个class,因此使用大写的Koa表示 */
const Koa = require('koa')
const {
  Nuxt,
  Builder
} = require('nuxt')

/* 用来记录接口请求 */
const bunyan = require('bunyan')
const koaBunyan = require('koa-bunyan')
/* mkdirp用来创建目录|问件 */
const mkdirp = require('mkdirp')
/* 请求的url、状态码、响应时间、响应体大小等信息 */
const koaLogger = require('koa-bunyan-logger')

/* middleware composer */
const compose = require('koa-compose')

/* 处理请求参数 */
const koaConnect = require('koa-connect')
/* session for flash messages */
const session = require('koa-session')
/* HTTP compression */
const compress = require('koa-compress')
/* body parser */
const body = require('koa-body')

/* api */
const api = require('./api')
/* 常量 */
const consts = require('./utils/consts')
/* nuxt配置文件 */
const config = require('../nuxt.config.js')

/* npm color */
const chalk = require('chalk')

/* http代理事件 */
const proxy = require('koa-proxies')

/* 查询、开启进程 */
const childProcess = require('child_process')

/* koa启动 */
async function start () {
  const isWin = /^win/.test(process.platform)
  const host = consts.HOST
  const port = consts.PORT
  const app = new Koa()

  app.keys = ['hero-server']
  config.dev = !(app.env === 'production')
  /* 日志 process.cwd() __dirname */
  let logDir = process.env.LOG_DIR || (isWin ? process.cwd() + '\\log' : '/var/tmp/log')
  /* console.log('日志文件:::' + logDir) */
  mkdirp.sync(logDir)
  logDir = logDir.replace(/(\\|\/)+$/, '') + (isWin ? '\\\\' : '/')

  const access = {
    type: 'rotating-file',
    path: `${logDir}hero-access.log`,
    level: config.dev ? 'debug' : 'info',
    period: '1d',
    count: 4
  }
  const error = {
    type: 'rotating-file',
    path: `${logDir}hero-error.log`,
    level: 'error',
    period: '1d',
    count: 4
  }
  const logger = bunyan.createLogger({
    name: 'hero',
    streams: [
      access,
      error
    ]
  })
  app.use(koaBunyan(logger, {
    level: config.dev ? 'debug' : 'info'
  }))
  /* 开启日志 */
  app.use(koaLogger(logger))

  // select sub-app (admin/api) according to host subdomain (could also be by analysing request.url);
  // separate sub-apps can be used for modularisation of a large system, for different login/access
  // rights for public/protected elements, and also for different functionality between api & web
  // pages (content negotiation, error handling, handlebars templating, etc).

  app.use(async function subApp (ctx, next) {
    /* 使用子域名来决定服务哪个应用: 默认情况下www. 或admin. 或api */
    ctx.state.subapp = ctx.url.split('/')[1] /* 子域名=主机名第一个+'/'+后面的部分 */
    /* 注意:可以使用根路径而不是子域,例如ctx.request.url.split('/')[1] */
    await next()
  })

  const nuxt = new Nuxt(config)
  /* 仅在开发模式下构建 */
  // const isDev = config.dev ? "开发" : "生产"
  // console.log(`当前模式:::${isDev}`)
  if (config.dev) {
    const devConfigs = config.development
    if (devConfigs && devConfigs.proxies) {
      for (let proxyItem of devConfigs.proxies) {
        /* console.log(`Active Proxy: path[${proxyItem.path}] target[${proxyItem.target}]`) */
        app.use(proxy(proxyItem.path, proxyItem))
      }
    }
    await new Builder(nuxt).build()
  }
  const nuxtRender = koaConnect(nuxt.render)

  app.use(async (ctx, next) => {
    await next()
    if (ctx.state.subapp !== consts.API) {
      ctx.status = 200 // 状态未设置时默认为404
      ctx.req.session = ctx.session
      await nuxtRender(ctx)
    }
  })

  /* 在这里添加有效的和预先准备好的钩子,确保会话是有效的#TODO */
  const SESSION_CONFIG = {
    key: consts.SESS_KEY
  }

  /* 用于flash消息的会话(使用签名会话cookie，没有服务器存储) */
  app.use(session(SESSION_CONFIG, app))

  // /* 在X-Response-Time报头中返回响应时间 */
  // app.use(async function responseTime (ctx, next) {
  //   const t1 = Date.now()
  //   await next()
  //   const t2 = Date.now()
  //   ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')

  //   /**
  //    * In case you wanna see what you received from postRequest, or other endpoints.
  //    * 如果您想看看从postRequest或其他端点接收到什么
  //    */
  //   const logRequestUrlResponse = '/hpi/auth/login'
  //   const logHpiAuthLogin = ctx.request.url === logRequestUrlResponse
  //   if (logHpiAuthLogin === 'lllllllllllllllllllll') {
  //     const debugObj = JSON.parse(JSON.stringify(ctx))
  //     const body = JSON.parse(JSON.stringify(ctx.body || null))
  //     const responseHeaders = JSON.parse(JSON.stringify(ctx.response.header))
  //     const requestHeaders = JSON.parse(JSON.stringify(ctx.request.header))
  //     console.log(`Received for ${logRequestUrlResponse}`,
  //       { ctx: debugObj, body, responseHeaders, requestHeaders })
  //   }
  //   /* 查看接口的请求和相应 */
  //   const isHpi = /^\/hpi\//.test(ctx.request.url)
  //   const logHpi = false
  //   if (isHpi && logHpi && logHpiAuthLogin === false && '1' === '0') {
  //     const headers = Object.assign({}, JSON.parse(JSON.stringify(ctx.request.header)))
  //     console.log(`Request headers for ${ctx.url}`, headers)
  //   }
  // })

  /* HTTP compression */
  app.use(compress({}))

  /* 只搜索索引www子域名 */
  app.use(async function robots (ctx, next) {
    await next()
    if (ctx.hostname.slice(0, 3) !== 'www') {
      ctx.response.set('X-Robots-Tag', 'noindex, nofollow')
    }
  })

  /* 将请求体解析为ctx.request.body */
  app.use(body())

  /* 跟踪每一个请求 后边对接口的时候可能会有用吧... */
  app.use(async function (ctx, next) {
    await next()
  })

  /* 这必须是最后一个中间件 */
  app.use(async function composeSubapp (ctx, next) {
    switch (ctx.state.subapp) {
      case consts.API:
        await compose(api.middleware)(ctx)
        break
    }
  })

  app.listen(port, host)
  const _host = host === '0.0.0.0' ? 'localhost' : host
  // eslint-disable-next-line no-console
  console.log('\n' + chalk.bgGreen.black(' OPEN ') + chalk.green(` http://${_host}:${port}\n`))
  /* 默认浏览器打开 */
  childProcess.exec('start ' + `http://${_host}:${port}`)
}

start()
