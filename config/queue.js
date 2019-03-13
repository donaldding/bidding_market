const ProductModel = require('../app/models/product')
var kue = require('kue')
const queque = kue.createQueue()

queque.process('productPublish', function (job, done) {
  ProductModel.handleProductFinally(job.data.id, done)
})

module.exports = queque
