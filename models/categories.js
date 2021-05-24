'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  categories.init({
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.TEXT,
    category_type: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};