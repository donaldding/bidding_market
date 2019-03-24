const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const { User } = require('../../db/schema')
const pagination = require('../../util/pagination')

const secret = require('../../config/secret')
const renderResponse = require('../../util/renderJson')

class UserController {
  /**
   * 创建用户
   * @param ctx
   * @returns {Promise<void>}
   */
  static async create (ctx) {
    const user = ctx.request.body

    if (user.schood_num && user.password) {
      const existUser = await userModel.findBySchoodNum(user.schood_num)
      if (existUser) {
        // 反馈存在用户名
        ctx.response.status = 403
        ctx.body = renderResponse.ERROR_403('用户已经存在')
      } else {
        // 加密密码
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash

        // 创建用户
        const dbUser = await User.create(user)
        // 签发token
        const userToken = {
          schood_num: dbUser.schood_num,
          id: dbUser.id
        }
        // 储存token失效有效期1小时
        const token = jwt.sign(userToken, secret.sign, {
          expiresIn: '1h'
        })

        ctx.response.status = 200
        let { id, name, schood_num, enter_year, acadamy } = dbUser
        ctx.body = renderResponse.SUCCESS_200('注册成功', {
          id,
          name,
          schood_num,
          enter_year,
          acadamy,
          token
        })
      }
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('参数错误')
    }
  }

  /**
   * 登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login (ctx) {
    const data = ctx.request.body
    // 查询用户
    const user = await userModel.findBySchoodNum(data.schood_num)
    // 判断用户是否存在
    if (user) {
      // 判断前端传递的用户密码是否与数据库密码一致
      if (bcrypt.compareSync(data.password, user.password)) {
        // 用户token
        const userToken = {
          username: user.name,
          id: user.id
        }
        // 签发token
        const token = jwt.sign(userToken, secret.sign, {
          expiresIn: '1h'
        })

        ctx.response.status = 200
        let { id, name, schood_num, enter_year, acadamy } = user
        ctx.body = renderResponse.SUCCESS_200('登录成功', {
          id,
          name,
          schood_num,
          enter_year,
          acadamy,
          token
        })
      } else {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('用户名或密码错误')
      }
    } else {
      ctx.response.status = 403
      ctx.body = renderResponse.ERROR_403('用户不存在')
    }
  }

  /**
   * 获取用户信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserMsg (ctx) {
    const user = ctx.current_user
    if (user) {
      let { id, name, schood_num, enter_year, acadamy } = user
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('获取成功', {
        id,
        name,
        schood_num,
        enter_year,
        acadamy
      })
    } else {
      ctx.response.status = 403
      ctx.body = renderResponse.ERROR_403('用户不存在')
    }
  }

  /**
   * 查询用户列表（仅限管理员）
   * @param {*} ctx
   */
  static async all (ctx) {
    const data = ctx.request.body
    let list
    let meta
    const page = data.page ? data.page : 1
    const perPage = data.per_page ? data.per_page : 20
    await User.findAndCountAll({
      offset: 20 * (page - 1),
      limit: perPage
    }).then(result => {
      list = result.rows
      meta = {
        page: pagination(result.count, perPage),
        per_page: perPage,
        current_page: page
      }
    })

    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', list, meta)
  }
}

module.exports = UserController
