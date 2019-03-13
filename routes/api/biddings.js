const router = require('koa-router')()
const Controller = require('../../app/controller/bidding_controller')

router.prefix('/biddings')

router.get('/', Controller.index)
router.get('/my', Controller.my)
router.post('/', Controller.create)

module.exports = router
