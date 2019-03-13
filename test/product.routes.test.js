const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const { Product, User } = db
const login = require('./login')

// close the server after each test
afterAll(() => {
  return server.close()
})
beforeEach(async () => {
  await truncate()
})

describe('POST /api/products/', () => {
  test('should respond as expected', async () => {
    const loginUser = await login()

    const products = await Product.findAll()
    expect(products.length).toEqual(0)
    const response = await request(server)
      .post('/api/products')
      .send({
        name: 'test',
        description: 'aa',
        start_price: 100,
        banner_url: 'abc',
        duration: 100
      })
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return Product.findAll().then(datas => {
      expect(datas.length).toEqual(1)
      expect(datas[0].name).toEqual('test')
      expect(datas[0].description).toEqual('aa')
      expect(datas[0].start_price).toEqual(100)
      expect(datas[0].banner_url).toEqual('abc')
    })
  })
})

describe('GET /api/products/', () => {
  test('should all products', async () => {
    const loginUser = await login()
    await Product.create({
      name: 'test'
    })
    const response = await request(server)
      .get('/api/products')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data[0].name).toEqual('test')
  })
})

describe('GET /api/products/my', () => {
  test('should return user products', async () => {
    const loginUser = await login()
    const user = await User.findByPk(loginUser.body.data.id)
    await user.createPublishProduct({
      name: 'test'
    })

    const response = await request(server)
      .get('/api/products/my')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data[0].name).toEqual('test')
    expect(response.body.data[0].Owner.id).toEqual(user.id)
  })
})
