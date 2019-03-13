const { Category } = require('../../db/schema')
const renderResponse = require('../../util/renderJson')

class CategoryController {
  static async create (ctx) {
    let { name } = ctx.request.body
    if (name) {
      const existsCategory = await Category.findOne({
        name
      })
      if (existsCategory) {
        ctx.response.status = 403
        ctx.body = renderResponse.ERROR_403('已经存在相同名称的分类')
        return
      }
      const dbCategory = await Category.create({ name })
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('创建成功', dbCategory)
      return
    }
    ctx.response.status = 403
    ctx.body = renderResponse.ERROR_403('参数错误')
  }

  static async index (ctx) {
    const datas = await Category.findAll()
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  static async products (ctx) {
    const category = await Category.findByPk(ctx.params.id)
    const datas = await category.getProducts()
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }
}

module.exports = CategoryController
