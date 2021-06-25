'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.attributes.belongsTo(models.attribute_parent,{foreignKey: "parent_id"});
    }
  };
  attributes.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'attributes',
  });
  return attributes;
};