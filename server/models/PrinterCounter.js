const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Printer = require('./Printer');

const PrinterCounter = sequelize.define('PrinterCounter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  blackCounter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  colorCounter: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relacionamento com impressora
PrinterCounter.belongsTo(Printer, { foreignKey: 'printerId' });
Printer.hasMany(PrinterCounter, { foreignKey: 'printerId' });

module.exports = PrinterCounter;