'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attribute_parent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.attribute_parent.hasMany(models.attributes,{foreignKey: "parent_id"});
    }
  };
  attribute_parent.init({
    name: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'attribute_parent',
  });
  return attribute_parent;
};