const server = require('./server')
const request = require('supertest')
const {
  User
} = require('../db/schema')
const bcrypt = require('bcryptjs')

async function login() {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync('123456', salt)
  await User.create({
    schood_num: '12345678',
    password: hash,
    is_admin: true,
    is_active: true
  })

  return await request(server)
    .post('/api/session/sign_in')
    .send({
      schood_num: '12345678',
      password: '123456'
    })
}

module.exports = login