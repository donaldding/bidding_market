const {
  Product,
  User
} = require('../../db/schema')
const renderResponse = require('../../util/renderJson')
const createProductBiddingJob = require('../jobs/createProductBiddingJob')
const fs = require('fs')

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
      var banner_url = ''
      if (process.env.NODE_ENV !== 'test') {
        const file = ctx.request.files.file
        if (file instanceof Array) {
          for (var i = 0; i < file.length; i++) {
            const reader = fs.createReadStream(file[i].path)
            const ext = file[i].name.split('.').pop() // 获取上传文件扩展名
            let randomNum = Math.random().toString()
            let path2 = `${__dirname}/../../public/images/${randomNum}.${ext}`
            var url = `/images/${randomNum}.${ext}`
            const upStream = fs.createWriteStream(path2) // 创建可写流
            reader.pipe(upStream) // 可读流通过管道写入可写流
            banner_url += url + ','
          }
        } else {
          const reader = fs.createReadStream(file.path)
          const ext = file.name.split('.').pop() // 获取上传文件扩展名
          let randomNum = Math.random().toString()
          let path2 = `${__dirname}/../../public/images/${randomNum}.${ext}`
          var url = `/images/${randomNum}.${ext}`
          const upStream = fs.createWriteStream(path2) // 创建可写流
          reader.pipe(upStream) // 可读流通过管道写入可写流
          banner_url += url + ','
        }
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
      include: [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'name']
      }]
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async my (ctx) {
    const user = ctx.current_user
    const datas = await user.getPublishProducts({
      include: [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'name']
      }]
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
