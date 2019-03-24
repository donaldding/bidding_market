const { Product, User } = require('../../db/schema')
const renderResponse = require('../../util/renderJson')
const createProductBiddingJob = require('../jobs/createProductBiddingJob')

class ProductController {
  static async create (ctx) {
    const user = ctx.current_user

    let {
      name,
      description,
      start_price,
      category_id,
      duration
    } = ctx.request.body

    if (name && start_price && duration && category_id) {
      const file = ctx.request.body.files.file
      var banner_url
      if (file) {
        const reader = fs.createReadStream(file.path)
        const ext = file.name.split('.').pop() // 获取上传文件扩展名
        banner_url = `${__dirname}/../../public/images/${Math.random().toString()}.${ext}`
        const upStream = fs.createWriteStream(path) // 创建可写流
        reader.pipe(upStream) // 可读流通过管道写入可写流
      }

      let curr_price = start_price
      const dbProduct = await user.createPublishProduct({
        category_id,
        name,
        description,
        start_price,
        banner_url,
        duration,
        curr_price,
        state: 'ready'
      })
      createProductBiddingJob(dbProduct)
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('创建成功', dbProduct)
      return
    }
    ctx.response.status = 412
    ctx.body = renderResponse.ERROR_412('参数错误')
  }

  static async index (ctx) {
    const datas = await Product.findAll({
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'name']
        }
      ]
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async my (ctx) {
    const user = ctx.current_user
    const datas = await user.getPublishProducts({
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'name']
        }
      ]
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async detail (ctx) {
    const datas = await Product.findById(ctx.params.id)
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }
}

module.exports = ProductController
