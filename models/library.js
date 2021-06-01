'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class library extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  library.init({
    name: DataTypes.TEXT,
    url: DataTypes.TEXT,
    cloudinary_id: DataTypes.TEXT,
    thumbnail: DataTypes.TEXT,
    medium: DataTypes.TEXT,
    large: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'library',
  });
  return library;
};