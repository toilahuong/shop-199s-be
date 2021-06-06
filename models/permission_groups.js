'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class permission_groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.permission_groups.hasMany(models.permissions, {foreignKey: "group_id"});
    }
  };
  permission_groups.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'permission_groups',
  });
  return permission_groups;
};