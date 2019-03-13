const queue = require('../../config/queue')

module.exports = function (product) {
  queue
    .create('productPublish', {
      id: product.id
    })
    .delay(product.duration)
    .save()
}
