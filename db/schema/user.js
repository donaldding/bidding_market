'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      schood_num: DataTypes.STRING,
      password: DataTypes.STRING,
      enter_year: DataTypes.STRING,
      acadamy: DataTypes.STRING,
      gender: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    // associations can be defined here
  }
  return User
}
