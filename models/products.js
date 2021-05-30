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
    name: DataTypes.TEXT,
    code: DataTypes.TEXT,
    description: DataTypes.TEXT,
    details: DataTypes.STRING,
    quantily: DataTypes.INTEGER,
    regular_price: DataTypes.INTEGER,
    sale_price: DataTypes.INTEGER,
    status: DataTypes.TEXT,
    slug: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};