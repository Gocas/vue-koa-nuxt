// 引入 Koa
const Koa = require('koa')
// XML
const xmlify = require('xmlify')
// YAML
const yaml = require('js-yaml')

const consts = require('../utils/consts')
const auth = require('./routes-auth')
const examples = require('./routes-examples')
const menu = require('./routes-menu')

// API app
const app = new Koa()

// api将使用json、xml或yaml进行响应
app.use(async function contentNegotiation (ctx, next) {
  await next()
  // 返回
  if (!ctx.body) return

  // 检查Accept报头是否为首选响应类型
  const type = ctx.accepts('json', 'xml', 'yaml', 'text')

  switch (type) {
    case 'json':
    default:
      delete ctx.body.root // 删除xml根元素
      break // ... koa takes care of type
    case 'xml':
      try {
        const root = ctx.body.root // xml根元素
        delete ctx.body.root
        ctx.body = xmlify(ctx.body, root)
        ctx.type = type // 只有在xmlify没有抛出时才更改类型
      } catch (e) {
        console.log(`无法转换为XML，退回到默认值::Could not convert to XML, falling back to default`)
      }
      break
    case 'yaml':
    case 'text':
      delete ctx.body.root // xml根元素
      ctx.type = 'yaml'
      ctx.body = yaml.dump(ctx.body)
      break
    case false:
      ctx.throw(406) // '不可接受'——不能提供任何要求,返回406
      break
  }
})

// 处理抛出或未捕获的异常
app.use(async function handleErrors (ctx, next) {
  try {
    await next()
  } catch (e) {
    ctx.status = e.status || 500
    switch (ctx.status) {
      case 204: // 未找到对应内容
        break
      case 401: // 未授权
      case 403: // 被禁止
      case 404: // 未找到对应资源
      case 406: // 不能被接受的请求
      case 409: // 有冲突
        ctx.body = {
          root: 'error'
          // ...e错误
        }
        break
      default:
      case 500: // 内部服务器错误(未捕获或编程错误)
        console.error(ctx.status, e.message)
        ctx.body = {
          root: 'error'
          // ...e
        }
        if (app.env !== 'production') ctx.body.stack = e.stack
        ctx.app.emit('error', e, ctx) // 异常处理参考： github.com/koajs/koa/wiki/Error-Handling
        break
    }
  }
})

// ------------ routing 路由

// 1.公共(不安全)模块

app.use(auth)
app.use(menu)

if (consts.SHOW_EXAMPLES === true) {
  app.use(examples)
}

// 验证 token

// 自定义模块

module.exports = app
