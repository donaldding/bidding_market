const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const User = db['User']
const login = require('./login')
const createUser = require('./createUser')

// close the server after each test
afterAll(() => {
  return server.close()
})
beforeEach(async () => {
  await truncate()
})

describe('POST /api/session/sign_up', () => {
  test('should respond as expected', async () => {
    const users = await User.findAll()
    expect(users.length).toEqual(0)
    await User.create({
      schood_num: '12345678'
    })
    const response = await request(server)
      .post('/api/session/sign_up')
      .send({
        schood_num: '12345678',
        password: '123456',
        name: 'test',
        enter_year: '2010',
        acadamy: 'sci'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return User.findAll().then(datas => {
      expect(datas.length).toEqual(1)
      expect(datas[0].schood_num).toEqual('12345678')
      expect(datas[0].name).toEqual('test')
      expect(datas[0].enter_year).toEqual('2010')
      expect(datas[0].acadamy).toEqual('sci')
      expect(datas[0].is_active).toEqual(true)
    })
  })
  test('schood_num is not entry', async () => {
    const response = await request(server)
      .post('/api/session/sign_up')
      .send({
        schood_num: '12345679',
        password: '123456',
        name: 'test',
        enter_year: '2010',
        acadamy: 'sci'
      })
    expect(response.status).toEqual(403)
    expect(response.type).toEqual('application/json')
  })
})

describe('POST /api/session/sign_in', () => {
  test('should respond as expected', async () => {
    await User.create({
      schood_num: '12345678'
    })
    await request(server)
      .post('/api/session/sign_up')
      .send({
        schood_num: '12345678',
        password: '123456',
        name: 'test',
        enter_year: '2010',
        acadamy: 'sci'
      })
    const response = await request(server)
      .post('/api/session/sign_in')
      .send({
        schood_num: '12345678',
        password: '123456'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.schood_num).toEqual('12345678')
  })
  test('student is not active', async () => {
    await User.create({
      schood_num: '12345678'
    })
    const response = await request(server)
      .post('/api/session/sign_in')
      .send({
        schood_num: '12345678',
        password: '123456'
      })
    expect(response.status).toEqual(403)
    expect(response.type).toEqual('application/json')
  })
})

describe('GET /api/users/info', () => {
  test('should respond as expected', async () => {
    const createUser = await login()

    const response = await request(server)
      .get('/api/users/info')
      .set('Authorization', createUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.schood_num).toEqual('12345678')
  })
})

describe('GET /api/users/all', () => {
  beforeEach(async () => {
    await truncate()
  })

  test('should return users(When the user is 1)', async () => {
    const loginUser = await login()

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
  })
  test('should return users(When many users)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser(i)
    }

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(2)
  })
  test('should return users(When send per_page)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser(i)
    }

    const response = await request(server)
      .get('/api/users/all/?per_page=19')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.per_page).toEqual("19")
    expect(response.body.data.length).toEqual(19)
  })
  test('should return users(When send page)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser(i)
    }

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)
      .send({
        page: 2
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(2)
  })
})

describe('POST /api/users/entry', () => {
  test('should respond as expected', async () => {
    const loginUser = await login()

    let user = '1234567890,1234567891,1234567892'

    const response = await request(server)
      .post('/api/users/entry')
      .set('Authorization', loginUser.body.data.token)
      .send({
        schood_nums: user
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.length).toEqual(3)
    expect(response.body.data[0].is_active).toEqual(false)
    expect(response.body.data[0].schood_num).toEqual('1234567890')
  })
})