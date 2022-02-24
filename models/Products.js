const { DataTypes } = require('sequelize');
const { getSequelize } = require('../connections/MysqlConnection');
const sequelize = getSequelize();

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports =  Product;
