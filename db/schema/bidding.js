'use strict'
module.exports = (sequelize, DataTypes) => {
  const Bidding = sequelize.define(
    'Bidding',
    {
      product_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER
    },
    {}
  )
  Bidding.associate = function (models) {
    Bidding.belongsTo(models['User'], {
      foreignKey: 'user_id',
      as: 'User'
    })
    Bidding.belongsTo(models['Product'], {
      foreignKey: 'product_id',
      as: 'Product'
    })
  }

  return Bidding
}
