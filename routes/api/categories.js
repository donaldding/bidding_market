const router = require('koa-router')()
const CategoryController = require('../../app/controller/category_controller')

router.prefix('/categories')

router.get('/', CategoryController.index)
router.post('/', CategoryController.create)
router.get('/:id/products', CategoryController.products)

module.exports = router
