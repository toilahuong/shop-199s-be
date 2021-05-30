'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.categories.belongsToMany(models.products, {through: "category_products", foreignKey: "category_id"})
      models.products.belongsToMany(models.categories, {through: "category_products",foreignKey: "product_id"})
    }
  };
  category_product.init({
    product_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'category_product',
  });
  return category_product;
};