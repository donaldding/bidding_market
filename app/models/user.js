const { User } = require('../../db/schema')

User.sync({
  force: false
})

class UserModel {
  /**
   * 删除用户
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async delete (id) {
    return User.destroy({
      where: {
        id
      }
    })
  }

  /**
   * 查询用户列表
   * @returns {Promise<*>}
   */
  static async findAllUserList () {
    return User.findAll({
      attributes: ['id', 'cellphone']
    })
  }

  /**
   * 查询用户信息
   * @param cellphone  手机号
   * @returns {Promise.<*>}
   */
  static async findBySchoodNum (schood_num) {
    return User.findOne({
      where: {
        schood_num
      }
    })
  }

  /**
   * @param userid 用户id
   * @returns {Promise.<*>}
   */
  static async findById (userid) {
    return User.findOne({
      where: {
        id: userid
      }
    })
  }
}

module.exports = UserModel
