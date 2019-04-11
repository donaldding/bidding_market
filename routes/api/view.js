const router = require('koa-router')()
const {
  User,
  Product,
  Category
} = require('../../db/schema')

router.prefix('/admin')

router.get('/', async (ctx, next) => {
  const title = 'hello ddc'
  await ctx.render('index', {
    title
  })
})

router.get('/products', async (ctx, next) => {
  const products = await Product.findAll({
    include: [{
      model: User,
      as: 'Owner',
      attributes: ['id', 'name']
    },
    {
      model: Category,
      as: 'Category',
      attributes: ['id', 'name']
    },
    {
      model: User,
      as: 'Buyer',
      attributes: ['id', 'name']
    }
    ]
  })
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

router.post('/users/:id/delete', async (ctx, next) => {
  User.destroy({
    where: {
      id: ctx.params.id
    }
  })
  const users = await User.findAll()
  await ctx.render('users', {
    users
  })
})

router.post('/products/activate', async (ctx, next) => {
  const data = await Product.findByPk(ctx.request.body.id)
  await data.update({
    is_active: true
  })

  const products = await Product.findAll({
    include: [{
      model: User,
      as: 'Owner',
      attributes: ['id', 'name']
    },
    {
      model: Category,
      as: 'Category',
      attributes: ['id', 'name']
    },
    {
      model: User,
      as: 'Buyer',
      attributes: ['id', 'name']
    }
    ]
  })
  await ctx.render('products', {
    products
  })
})

router.post('/users/entry', async (ctx, next) => {
  let schoodNums = []
  let arr = ctx.request.body.schood_nums.split(',')
  for (var key in arr) {
    let student = {
      schood_num: arr[key]
    }
    schoodNums.push(student)
  }

  await User.bulkCreate(schoodNums)
  const users = await User.findAll()
  await ctx.render('users', {
    users
  })
})

router.get('/categories', async (ctx, next) => {
  const datas = await Category.findAll()
  await ctx.render('categories', {
    datas
  })
})

router.post('/categories', async (ctx, next) => {
  let {
    name
  } = ctx.request.body
  if (name) {
    await Category.create({
      name
    })
  }
  const datas = await Category.findAll()
  await ctx.render('categories', {
    datas
  })
})
// router.post('/sign_in', UserController.login)

module.exports = router
