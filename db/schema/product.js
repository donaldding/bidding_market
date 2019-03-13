'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      start_price: DataTypes.INTEGER,
      curr_price: DataTypes.INTEGER,
      last_buyer_id: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      state: DataTypes.STRING,
      banner_url: DataTypes.STRING
    },
    {}
  )
  Product.associate = function (models) {
    Product.belongsTo(models['User'], {
      foreignKey: 'owner_id',
      as: 'Owner'
    })
    Product.belongsTo(models['Category'], {
      foreignKey: 'category_id',
      as: 'Category'
    })
    Product.belongsTo(models['User'], {
      foreignKey: 'last_buyer_id',
      as: 'Buyer'
    })
  }
  return Product
}
