const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '/.env')
})
const Koa = require('koa')

const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const authorize = require('./app/middleware/authenticate')
const cors = require('koa2-cors')
const apiRouter = require('./routes/api')
const session = require('./routes/api/session')
const view = require('./routes/api/view')
const koaBody = require('koa-body')

// error handler
onerror(app)

// middlewares
app.use(
  // bodyparser({
  //   enableTypes: ['json', 'form', 'text']
  // })
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 500 * 1024 * 1024
    }
  })
)
app.use(json())
if (process.env.NODE_ENV != 'test') {
  app.use(logger())
}
app.use(require('koa-static')(`${__dirname}/public`))

app.use(
  views(`${__dirname}/views`, {
    extension: 'pug'
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(view.routes())
app.use(cors())
app.use(session.routes())
app.use(authorize())
app.use(apiRouter.routes(), apiRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
