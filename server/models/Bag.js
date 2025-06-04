const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');

const Bag = sequelize.define('Bag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('backpack', 'case', 'bag'),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  identificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  condition: {
    type: DataTypes.ENUM('new', 'good', 'fair', 'poor'),
    defaultValue: 'good'
  },
  status: {
    type: DataTypes.ENUM('assigned', 'available', 'maintenance', 'retired'),
    defaultValue: 'available'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relacionamento com usuário
Bag.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

module.exports = Bag;