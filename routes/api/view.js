const router = require('koa-router')()
const { User, Product } = require('../../db/schema')

router.prefix('/admin')

router.get('/', async (ctx, next) => {
  const title = 'hello ddc'
  await ctx.render('index', {
    title
  })
})

router.get('/products', async (ctx, next) => {
  const products = await Product.findAll()
  await ctx.render('products', {
    products
  })
})

router.get('/users', async (ctx, next) => {
  const users = await User.findAll()
  await ctx.render('users', {
    users
  })
})
// router.post('/sign_in', UserController.login)

module.exports = router
