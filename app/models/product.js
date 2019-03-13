const { Product } = require('../../db/schema')

Product.sync({
  force: false
})

class ProductModel {
  static async delete (id) {
    return Product.destroy({
      where: {
        id
      }
    })
  }

  /**
   * @param userid 用户id
   * @returns {Promise.<*>}
   */
  static handleProductFinally (id, done) {
    Product.findByPk(id).then(product => {
      if (product.state === 'ready') {
        product
          .update({
            state: 'fail'
          })
          .then(() => {
            console.log(`Product ${id} fail because no one bid for it`)
            done()
          })
      } else if (product.state === 'bidding' && product.last_buyer_id) {
        product
          .update({
            state: 'finish'
          })
          .then(() => {
            console.log(
              `Product ${id} finish at price ${product.curr_price} and user ${
                product.last_buyer_id
              }`
            )
            done()
          })
      } else {
        product
          .update({
            state: 'error'
          })
          .then(() => {
            console.log(`Product ${id} error`)
          })
      }
    })
  }
}

module.exports = ProductModel
