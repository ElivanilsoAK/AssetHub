const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');

const Computer = sequelize.define('Computer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('notebook', 'desktop'),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  processor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  memory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  storage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  operatingSystem: {
    type: DataTypes.STRING,
    allowNull: true
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  warrantyExpiration: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired', 'stock'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relacionamento com usuário
Computer.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

module.exports = Computer;