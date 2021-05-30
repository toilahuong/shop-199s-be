'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.permissions.belongsToMany(models.roles, {through: "role_permissions", foreignKey: "permission_id"})
      models.roles.belongsToMany(models.permissions, {through: "role_permissions",foreignKey: "role_id"})
    }
  };
  role_permission.init({
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'role_permission',
  });
  return role_permission;
};