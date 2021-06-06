'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // products.belongsToMany(models.categories, {through: "category_product"});
    }
  };
  products.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    description: DataTypes.TEXT('long'),
    details: DataTypes.TEXT('long'),
    quantily: DataTypes.INTEGER,
    regular_price: DataTypes.INTEGER,
    sale_price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};