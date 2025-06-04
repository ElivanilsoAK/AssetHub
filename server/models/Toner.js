// server/models/Toner.js
const { DataTypes } = require('sequelize'); //
const sequelize = require('../database/database'); //

const Toner = sequelize.define('Toner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'black', // Ex: black, cyan, magenta, yellow
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  compatiblePrinters: {
    type: DataTypes.STRING, // String para armazenar múltiplos modelos separados por vírgula
    allowNull: true,
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'available', // Ex: available, in_stock, low_stock, empty, discarded
  },
}, {
  timestamps: true,
});

module.exports = Toner;