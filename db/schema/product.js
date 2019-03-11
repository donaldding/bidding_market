'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      start_price: DataTypes.INTEGER,
      curr_price: DataTypes.INTEGER,
      state: DataTypes.STRING
    },
    {}
  )
  Product.associate = function (models) {
    Product.belongsTo(models['User'], {
      foreignKey: 'owner_id',
      as: 'owner'
    })
    Product.belongsTo(models['Category'], {
      foreignKey: 'category_id',
      as: 'category'
    })
    Product.belongsTo(models['User'], {
      foreignKey: 'last_buyer_id',
      as: 'buyer'
    })
  }
  return Product
}
