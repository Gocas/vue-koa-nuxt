/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  处理身份验证的路由.                                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const koaRouter = require('koa-router')
const svgCaptcha = require('svg-captcha')
const translatorFactory = require('../utils/translator')
const consts = require('../utils/consts')
const { get } = require('lodash')
const {
  decode,
  createRequest,
  getUserData
} = require('../utils/helpers')

/**
 * 具体信息查看 ../utils/consts.js
 */
const ENDPOINT_BACKEND_AUTH = consts.ENDPOINT_BACKEND_AUTH
const ENDPOINT_BACKEND_VALIDATE = consts.ENDPOINT_BACKEND_VALIDATE

/*
 * 是否要模拟身份验证
 * 应该在const文件中写明,或者通过 .env文件 .TODO
 */
const MOCK_ENDPOINT_BACKEND = consts.MOCK_ENDPOINT_BACKEND === true

/**
 * 注意!我们没有将 BASE_API 设置为 /hpi/auth ,
 * 因为这个文件是关于为Vue.js提供现成数据的
 *
 * 这么做意味着客户端的 .vue 文件将调用 /hpi/auth/login ,
 *  BUT = require(在这里，我们将调用公共不可用的其他端点)
 *
 * 也就是说,这个Koa子应用程序响应 /hpi (consts.BASE_API)
 * 如果需要模拟一个实际的后端
 * 那么为一个规范端点URL提供一个模拟答案,并使用/hpi作为前缀.
 */

const router = koaRouter({
  prefix: consts.BASE_API
})

/**
 * 参考 ../utils/translator
 * 人们可能想要检测用户语言环境并使用适当的语言提供服务
 * 但是这里需要做更多的工作
 * 因为这不是在客户端运行的,而且每次加载都有新的数据
 * 这里是一个具有持久状态的运行时.
 * 因此,不能让Koa将所有可能的翻译都保存在内存中.
 */

const translator = translatorFactory('en')

/**
 * 响应身份验证请求 即登陆接口 requests = require(Vue/Nuxt.
 *
 * 注意! 在这里也设置了一个cookiee.
 * 这是为了验证用户的合法性,实际中我们并不能保证每个用户发出的请求都是真实的,唯一的
 * 所以我们使用JWT为每个注册登陆成功的用户设置唯一的token,并且保存在Cookie,来保证每次接收到的请求都是合法的.
 *
 * */
router.post('/auth/login', async (ctx) => {
  const user = ctx.request.body
  if (!user || !user.userName || !user.password) {
    ctx.throw(401, translator.translate('请正确填写用户名和密码'))
  }
  let enforceCaptcha = false
  const shouldBe = ctx.session.captcha.toLowerCase() || 'bogus-user-captcha-entry'
  const userCaptchaEntry = user.captcha.toLowerCase() || 'bogus-should-be'
  enforceCaptcha = shouldBe !== userCaptchaEntry
  // enforceCaptcha = false
  if (enforceCaptcha) {
    ctx.throw(401, translator.translate('验证码无效'))
  }
  try {
    console.log(11111)
    // 在这我们尝试使用 base64 对用户密码进行加密处理
    const password = Buffer.from(user.password).toString('base64')
    const payload = {
      username: user.userName, // 如果前端传过来的用户名 key 和后端数据查找的不一样需要做映射
      password,
      grant_type: 'password'
    }
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    // 设置 token 之外的请求头
    // headers.Authorization = 'Basic YmFzLWNsaWVudDpYMmNYeW1nWkRrRkE3RWR0'
    const requestConfig = {
      payload,
      headers
    }
    const response = await createRequest('POST', ENDPOINT_BACKEND_AUTH, requestConfig)
    const jwt = response.access_token
    /**
     * 可以(也可以不)使用Koa会话默认存储机制作为 cookie.
     *
     * 只有当JWT令牌作为HttpOnly cookie与浏览器共享时,才可以使用cookie存储它
     * 这是Koa会话在默认情况下所做的,我们在这里不需要 require(Axios和Nuxt) 因为Koa实际上可以编写HttpOnly cookie
     *
     * 如果您不想使用coookies,请参考外部会话存储[1]中的 koajs/session
     *
     * [1]: https://github.com/koajs/session#external-session-stores
     *
     * rel: #JwtTokenAreTooValuableToBeNonHttpOnly
     */
    ctx.session.jwt = jwt
    ctx.body = response
  } catch (error) {
    let message = translator.translate('auth.login.service.error')
    ctx.log.error({ error }, message)
    let data = null
    if ((data = error && error.response && error.response.data)) {
      message = data.message || data.errors
    }
    ctx.throw(401, message)
  }
})

/**
 * #JwtTokenAreTooValuableToBeNonHttpOnly
 *
 * What keys/values do you want to expose to the UI.
 * Those are taken = require(an authoritative source (the JWT token)
 * and we might want the UI to show some data.
 *
 * Notice one thing here, although we’re reading the raw JWT token
 * = require(cookie, it IS HttpOnly, so JavaScript client can't access it.
 *
 * So, if you want to expose data served = require(your trusty backend,
 * here is your chance.
 *
 * This is how we’ll have Vue/Nuxt (the "client") read user data.
 *
 * Reason of why we’re doing this? Refer to [1]
 *
 * [1]: https://dev.to/rdegges/please-stop-using-local-storage-1i04
 */
router.get('/auth/whois', async (ctx) => {
  let body = {
    authenticated: false
  }
  const jwt = ctx.session.jwt || null
  let data = {}
  if (jwt !== null) {
    data = decode(jwt)
  }
  let userData = {}
  try {
    userData = await getUserData(jwt)
    const UserInfo = get(userData, 'UserInfo', {})
    data.UserInfo = Object.assign({}, UserInfo)
    body.authenticated = userData.status === 'valid' || false
  } catch (e) {
    // Nothing to do, body.authenticated defaults to false. Which would be what we want.
  }

  /**
   * Each key represent the name you want to expose.
   * Each member has an array of two;
   * Index 0 is "where" inside the decoded token you want to get data from
   * Index 1 is the default value
   */
  const keysMapWithLodashPathAndDefault = {
    userName: ['UserInfo.UserName', 'anonymous'],
    uid: ['userId', ''],
    roles: ['scope', []],
    exp: ['exp', 9999999999999],
    displayName: ['UserInfo.DisplayName', 'Anonymous'],
    tz: ['UserInfo.TimeZone', 'UTC'],
    locale: ['UserInfo.PreferredLanguage', 'en-US']
  }

  for (const [
    key,
    pathAndDefault
  ] of Object.entries(keysMapWithLodashPathAndDefault)) {
    const path = pathAndDefault[0]
    const defaultValue = pathAndDefault[1]
    const attempt = get(data, path, defaultValue)
    body[key] = attempt
  }

  ctx.status = 200
  ctx.body = body
})

/**
 * This is to compensate using localStorage for token
 * Ideally, this should NOT be used as-is for a production Web App.
 * Only moment you’d want to expose token is if you have SysAdmins
 * who wants to poke APIs manually and needs their JWT tokens.
 */
router.get('/auth/token', async (ctx) => {
  ctx.assert(ctx.session.jwt, 401, 'Requires authentication')
  let body = {}
  try {
    const token = ctx.session.jwt
    body.jwt = token
  } catch (e) {
    // Nothing to do, body.authenticated defaults to false. Which would be what we want.
  }

  ctx.status = 200
  ctx.body = body
})

router.get('/auth/validate', async (ctx) => {
  let body = {}
  let userData = {}
  let authenticated = false
  const jwt = ctx.session.jwt || null

  try {
    userData = await getUserData(jwt)
    authenticated = userData.status === 'valid' || false
  } catch (e) {
    // Nothing to do, body.authenticated defaults to false. Which would be what we want.
  }

  // Maybe your endpoint returns a string here.
  body.authenticated = authenticated

  ctx.status = 200
  ctx.body = body
})

router.post('/auth/logout', async (ctx) => {
  ctx.assert(ctx.session.jwt, 401, 'Requires authentication')
  ctx.session.jwt = null
  ctx.status = 200
})

router.get('/auth/captcha', async (ctx, next) => {
  await next()
  const width = ctx.request.query.width || 150
  const height = ctx.request.query.height || 36
  let captcha = svgCaptcha.create({
    width,
    height,
    size: 4,
    noise: 1,
    fontSize: width > 760 ? 40 : 30,
    // background: '#e8f5ff',
    ignoreChars: '0oO1iIl'
  })
  ctx.session.captcha = captcha.text
  ctx.type = 'image/svg+xml'
  ctx.body = captcha.data
})

if (MOCK_ENDPOINT_BACKEND) {
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   * Mocking responses, this is how you can emulate an actual backend.
   * Notice the URL below is assumed to begin by /hpi.
   *
   * When you'll use your own backend, URLs below WILL NOT have /hpi as prefix.
   */

  router.post(ENDPOINT_BACKEND_AUTH, async (ctx) => {
    // console.log(`Mocking a response for ${ctx.url}`)
    /**
     * The following JWT access_token contains;
     * See https://jwt.io/
     *
     * ```json
     * {
     *   "aud": [
     *     "bas"
     *   ],
     *   "user_name": "admin",
     *   "scope": [
     *     "read"
     *   ],
     *   "exp": 9999999999999,
     *   "userId": "40288b7e5bcd7733015bcd7fd7220001",
     *   "authorities": [
     *     "admin"
     *   ],
     *   "jti": "72ec3c43-030a-41ed-abb2-b7a269506923",
     *   "client_id": "bas-client"
     * }
     * ```
     */
    ctx.body = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJhdWQiOlsiYmFzIl0sInVzZXJfbmFtZSI6ImFkbWluIiwic' +
        '2NvcGUiOlsicmVhZCJdLCJleHAiOjk5OTk5OTk5OTk5OTksIn' +
        'VzZXJJZCI6IjQwMjg4YjdlNWJjZDc3MzMwMTViY2Q3ZmQ3MjI' +
        'wMDAxIiwiYXV0aG9yaXRpZXMiOlsiYWRtaW4iXSwianRpIjoi' +
        'NzJlYzNjNDMtMDMwYS00MWVkLWFiYjItYjdhMjY5NTA2OTIzI' +
        'iwiY2xpZW50X2lkIjoiYmFzLWNsaWVudCJ9.' +
        'uwywziNetHyfSdiqcJt6XUGy4V_WYHR4K6l7OP2VB9I'
    }
  })
  router.get(ENDPOINT_BACKEND_VALIDATE, async (ctx) => {
    // console.log(`Mocking a response for ${ctx.url}`)
    let fakeIsValid = false
    // Just mimicking we only accept as a valid session the hardcoded JWT token
    // = require(ENDPOINT_BACKEND_AUTH above.
    const tokenBeginsWith = /^Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./.test(ctx.querystring)
    if (tokenBeginsWith) {
      fakeIsValid = true
    }
    // When API returns strings, we will handle at validate
    const Status = fakeIsValid ? 'valid' : 'invalid'
    const validated = {
      Status
    }
    if (fakeIsValid) {
      validated.UserInfo = {
        UserName: 'admin',
        DisplayName: 'Haaw D. Minh',
        FirstName: 'Haaw',
        LastName: 'D. Minh',
        Email: 'root@example.org',
        PreferredLanguage: 'zh-HK',
        TimeZone: 'Asia/Hong_Kong'
      }
    }
    ctx.status = fakeIsValid ? 200 : 401
    ctx.body = validated
  })
} /* END MOCK_ENDPOINT_BACKEND */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = router.routes()
