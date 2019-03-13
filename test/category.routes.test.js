const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const { Product, Category } = db
const login = require('./login')
const createUser = require('./createUser')

// close the server after each test
afterAll(() => {
  return server.close()
})
beforeEach(async () => {
  await truncate()
})

describe('POST /api/categories/', () => {
  test('should respond as expected', async () => {
    const loginUser = await login()

    const categories = await Category.findAll()
    expect(categories.length).toEqual(0)
    const response = await request(server)
      .post('/api/categories')
      .send({
        name: 'test'
      })
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return Category.findAll().then(datas => {
      expect(datas.length).toEqual(1)
      expect(datas[0].name).toEqual('test')
    })
  })
})

describe('GET /api/categories/:id/products', () => {
  test('should respond as expected', async () => {
    const loginUser = await login()

    const category = await Category.create({
      name: 'test'
    })
    const product = await Product.create({
      name: 'p1'
    })
    await category.setProducts([product])

    const response = await request(server)
      .get(`/api/categories/${category.id}/products`)
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data[0].name).toEqual('p1')
  })
})

describe('GET /api/categories/', () => {
  test('should return users(When the user is 1)', async () => {
    const loginUser = await login()
    await Category.create({
      name: 'test'
    })
    const response = await request(server)
      .get('/api/categories')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data[0].name).toEqual('test')
  })
})
