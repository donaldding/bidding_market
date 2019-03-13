const router = require('koa-router')()
const UserController = require('../../app/controller/user_controller')

router.prefix('/api/session')

router.post('/sign_up', UserController.create)
router.post('/sign_in', UserController.login)

module.exports = router
