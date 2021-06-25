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
      models.library.hasMany(models.posts, {foreignKey: "thumbnail"});
      models.library.hasMany(models.categories, {foreignKey: "thumbnail"});
      models.library.hasMany(models.products, {as: "thumb", foreignKey: "thumbnail"});
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