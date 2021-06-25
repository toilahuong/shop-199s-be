'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.hasMany(models.posts, {foreignKey: "user_id"});
      models.users.hasMany(models.products, {foreignKey: "user_id"});
    }
  };
  users.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATEONLY,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};