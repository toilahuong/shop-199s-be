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
      models.products.belongsTo(models.library,{as: "thumb",foreignKey: "thumbnail"});
      models.products.belongsTo(models.users,{foreignKey: "user_id"});

    }
  };
  products.init({
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT('long'),
    details: DataTypes.TEXT('long'),
    thumbnail: DataTypes.INTEGER,
    quantily: DataTypes.INTEGER,
    regular_price: DataTypes.INTEGER,
    sale_price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    slug: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    post_date: DataTypes.DATE,
    sale_start_time: DataTypes.DATE,
    sale_end_time: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};