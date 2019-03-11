const { User } = require('../db/schema')
const bcrypt = require('bcryptjs')

async function createUser (schood_num) {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync('123456', salt)
  await User.create({
    schood_num: '12345' + schood_num,
    password: hash
  })
}

module.exports = createUser
