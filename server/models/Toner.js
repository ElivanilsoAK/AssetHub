const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Printer = require('./Printer');

const Toner = sequelize.define('Toner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.ENUM('black', 'cyan', 'magenta', 'yellow', 'other'),
    allowNull: false,
    defaultValue: 'black'
  },
  compatiblePrinters: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  minimumStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relacionamento com impressoras compatíveis (muitos para muitos)
Toner.belongsToMany(Printer, { through: 'PrinterToner', foreignKey: 'tonerId' });
Printer.belongsToMany(Toner, { through: 'PrinterToner', foreignKey: 'printerId' });

module.exports = Toner;