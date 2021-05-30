'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.belongsToMany(models.roles, {through: "role_users", foreignKey: "user_id"})
      models.roles.belongsToMany(models.users, {through: "role_users",foreignKey: "role_id"})
    }
  };
  role_user.init({
    role_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'role_user',
  });
  return role_user;
};