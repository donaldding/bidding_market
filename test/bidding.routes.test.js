const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const { Product, User, Bidding } = db
const login = require('./login')

// close the server after each test
afterAll(() => {
  return server.close()
})
beforeEach(async () => {
  await truncate()
})

describe('POST /api/biddings/', () => {
  beforeEach(async () => {
    await truncate()
  })

  test('create successful', async () => {
    const loginUser = await login()

    const biddings = await Bidding.findAll()
    expect(biddings.length).toEqual(0)

    const user = await User.findByPk(loginUser.body.data.id)
    const product = await user.createPublishProduct({
      name: 'test',
      start_price: 100,
      curr_price: 100,
      duration: 1000,
      state: 'ready'
    })

    const response = await request(server)
      .post('/api/biddings')
      .send({
        product_id: product.id,
        price: 110
      })
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    let product1 = await product.reload()
    expect(product1.curr_price).toEqual(110)
    expect(product1.last_buyer_id).toEqual(user.id)
    return Bidding.findAll().then(datas => {
      expect(datas.length).toEqual(1)
      expect(datas[0].user_id).toEqual(user.id)
      expect(datas[0].price).toEqual(110)
      expect(datas[0].product_id).toEqual(product.id)
    })
  })

  test('create fail if price too low', async () => {
    const loginUser = await login()

    const biddings = await Bidding.findAll()
    expect(biddings.length).toEqual(0)

    const user = await User.findByPk(loginUser.body.data.id)
    const product = await user.createPublishProduct({
      name: 'test',
      start_price: 100,
      duration: 1000
    })
    const response = await request(server)
      .post('/api/biddings')
      .send({
        product_id: product.id,
        price: 90
      })
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(412)
    expect(response.type).toEqual('application/json')
    return Bidding.findAll().then(datas => {
      expect(datas.length).toEqual(0)
    })
  })

  test('create fail if product not in progress', async () => {
    const loginUser = await login()

    const biddings = await Bidding.findAll()
    expect(biddings.length).toEqual(0)

    const user = await User.findByPk(loginUser.body.data.id)
    const product = await user.createPublishProduct({
      name: 'test',
      start_price: 100,
      duration: 1000,
      state: 'fail'
    })
    const response = await request(server)
      .post('/api/biddings')
      .send({
        product_id: product.id,
        price: 90
      })
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(412)
    expect(response.type).toEqual('application/json')
    return Bidding.findAll().then(datas => {
      expect(datas.length).toEqual(0)
    })
  })
})

describe('GET /api/biddings/', () => {
  test('should all biddings', async () => {
    const loginUser = await login()

    const user = await User.findByPk(loginUser.body.data.id)
    const product = await user.createPublishProduct({
      name: 'test',
      start_price: 100,
      duration: 1000
    })
    const bidding = await user.createBidding({
      product_id: product.id,
      price: 120,
      user_id: user.id
    })
    const response = await request(server)
      .get('/api/biddings')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data[0].id).toEqual(bidding.id)
    expect(response.body.data[0].User.id).toEqual(user.id)
    expect(response.body.data[0].Product.id).toEqual(product.id)
    expect(response.body.data[0].price).toEqual(120)
  })
})
