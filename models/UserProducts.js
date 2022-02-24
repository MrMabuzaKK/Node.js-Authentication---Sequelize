const { DataTypes } = require('sequelize');
const { getSequelize } = require('../connections/MysqlConnection');
const sequelize = getSequelize();

const UserProducts = sequelize.define("user-products", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: true,
  }
});

module.exports = UserProducts;
