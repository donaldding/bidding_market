'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', {
      name: DataTypes.STRING,
      schood_num: DataTypes.STRING,
      password: DataTypes.STRING,
      enter_year: DataTypes.STRING,
      acadamy: DataTypes.STRING,
      cellphone: DataTypes.STRING,
      dept: DataTypes.STRING
    }, {}
  )
  User.associate = function (models) {
    User.hasMany(models['Product'], {
        foreignKey: 'owner_id',
        as: 'PublishProducts'
      }),
      User.hasMany(models['Bidding'], {
        foreignKey: 'user_id',
        as: 'Biddings'
      }),
      User.hasMany(models['Product'], {
        foreignKey: 'last_buyer_id',
        as: 'BoughtProducts'
      })
  }
  return User
}