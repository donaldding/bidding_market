const { Product } = require('../../db/schema')
const renderResponse = require('../../util/renderJson')

class ProductController {
  static async create (ctx) {
    let { name, description, start_price, banner_url } = ctx.request.body
    const dbProduct = await Product.create({
      name,
      description,
      start_price,
      banner_url,
      state: 'ready'
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('创建成功', dbProduct)
  }

  static async index (ctx) {
    const datas = await Product.findAll({
      include: ['owner']
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async my (ctx) {
    const user = ctx.current_user
    const datas = await user.getPublishProducts({
      include: ['owner']
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }
}

module.exports = ProductController
