const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const {
  User
} = require('../../db/schema')
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
      if (existUser && existUser.is_active === false && existUser.name === user.name) {
        // 反馈存在用户名
        // 加密密码
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        user.is_active = true
        await delete user['schood_num']
        // 更新用户
        const dbUser = await User.update(user, {
          where: {
            id: existUser.id
          }
        })
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
        let {
          id,
          name,
          schood_num,
          enter_year,
          acadamy,
          cellphone,
          dept
        } = dbUser
        ctx.body = renderResponse.SUCCESS_200('注册成功', {
          id,
          name,
          schood_num,
          enter_year,
          acadamy,
          token,
          cellphone,
          dept
        })
      } else if (existUser && existUser.name !== user.name) {
        ctx.response.status = 403
        ctx.body = renderResponse.ERROR_403('学号与名字不匹配，不能注册')
      } else {
        ctx.response.status = 403
        ctx.body = renderResponse.ERROR_403('该学号尚未录入，不能注册')
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
    if (user && user.is_active === true) {
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
        let {
          id,
          name,
          schood_num,
          enter_year,
          acadamy
        } = user
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
      ctx.body = renderResponse.ERROR_403('用户不存在,或尚未注册')
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
      let {
        id,
        name,
        schood_num,
        enter_year,
        acadamy,
        cellphone,
        dept
      } = user
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('获取成功', {
        id,
        name,
        schood_num,
        enter_year,
        acadamy,
        cellphone,
        dept
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
    const data = ctx.request.query
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

  /**
   * 录入学号（仅限管理员）
   * @param {*} ctx
   */
  static async entry (ctx) {
    const data = ctx.request.body
    let schoodNums = []
    let arr = data.schood_nums.split(',')
    for (var key in arr) {
      let student = {
        schood_num: arr[key]
      }
      schoodNums.push(student)
    }

    await User.bulkCreate(schoodNums, {
      individualHooks: true
    }).then(data => {
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('录入成功', data)
    }).catch(r => {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('参数错误')
    })
  }
}

module.exports = UserController
