'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.posts.belongsTo(models.library,{foreignKey: "thumbnail"});
      models.posts.belongsTo(models.users,{foreignKey: "user_id"});
    }
  };
  posts.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT('long'),
    thumbnail: DataTypes.STRING,
    post_type: DataTypes.STRING,
    slug: DataTypes.STRING,
    status: DataTypes.STRING,
    post_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};