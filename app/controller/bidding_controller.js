const {
  Product,
  Bidding,
  User
} = require('../../db/schema')
const renderResponse = require('../../util/renderJson')

class BiddingController {
  static async create (ctx) {
    const user = ctx.current_user

    let {
      price,
      product_id
    } = ctx.request.body
    if (price && product_id) {
      const product = await Product.findByPk(product_id)
      if (price <= product.curr_price) {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('竞拍价必须大于当前价')
        return
      }
      if (product.state !== 'ready' && product.state !== 'bidding') {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('商品已结束竞拍')
        return
      }
      const updated_product = await product.update({
        curr_price: price,
        last_buyer_id: user.id
      })
      await user.createBidding({
        product_id,
        price,
        user_id: user.id
      })

      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('竞价成功', updated_product)
      return
    }
    ctx.response.status = 412
    ctx.body = renderResponse.ERROR_412('参数错误')
  }

  static async index (ctx) {
    const datas = await Bidding.findAll({
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'schood_num']
      },
      {
        model: Product,
        as: 'Product',
        attributes: ['id', 'name']
      }
      ]
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async my (ctx) {
    const user = ctx.current_user
    const datas = await user.getBiddings({
      include: [{
        model: Product,
        as: 'Product',
        attributes: ['id', 'name']
      }]
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }
}

module.exports = BiddingController
