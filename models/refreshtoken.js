'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RefreshToken.init({
    user_id: DataTypes.INTEGER,
    refresh_token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};