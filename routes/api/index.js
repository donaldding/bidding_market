const apiRouter = require('koa-router')()
const user = require('./users')
const categories = require('./categories')
const products = require('./products')
const biddings = require('./biddings')

apiRouter.prefix('/api')

const routers = [user, categories, products, biddings]
for (var router of routers) {
  apiRouter.use(router.routes(), router.allowedMethods())
}

module.exports = apiRouter
