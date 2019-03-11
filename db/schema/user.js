'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      schood_num: DataTypes.STRING,
      password: DataTypes.STRING,
      enter_year: DataTypes.STRING,
      acadamy: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models['Product'], {
      foreignKey: 'owner_id',
      as: 'publish_products'
    }),
    User.hasMany(models['Product'], {
      foreignKey: 'last_buyer_id',
      as: 'bought_products'
    })
  }
  return User
}
