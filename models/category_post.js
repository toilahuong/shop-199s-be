'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.categories.belongsToMany(models.posts, {through: "category_posts", foreignKey: "category_id"})
      models.posts.belongsToMany(models.categories, {through: "category_posts",foreignKey: "post_id"})
    }
  };
  category_post.init({
    post_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'category_post',
  });
  return category_post;
};