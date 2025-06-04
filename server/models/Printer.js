// server/models/Printer.js
const { DataTypes } = require('sequelize'); //
const sequelize = require('../database/database'); //

const Printer = sequelize.define('Printer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'laser', // Ex: laser, inkjet, matricial
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  identificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
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
    defaultValue: 'available', // Ex: available, in_use, maintenance, discarded
  },
}, {
  timestamps: true,
});

module.exports = Printer;