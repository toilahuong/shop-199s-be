'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class library_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.library.belongsToMany(models.products, {as: "images", through: "library_products", foreignKey: "library_id"})
      models.products.belongsToMany(models.library, {as: "images", through: "library_products",foreignKey: "product_id"})
    }
  };
  library_product.init({
    library_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    // type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'library_product',
  });
  return library_product;
};