const router = require('koa-router')()
const Controller = require('../../app/controller/product_controller')

router.prefix('/products')

router.get('/', Controller.index)
router.get('/my', Controller.my)
router.get('/:id/detail', Controller.detail)
router.post('/', Controller.create)

module.exports = router
