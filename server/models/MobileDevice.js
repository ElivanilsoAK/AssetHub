// server/models/MobileDevice.js
const { DataTypes } = require('sequelize'); //
const sequelize = require('../database/database'); //

const MobileDevice = sequelize.define('MobileDevice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'smartphone', // Ex: smartphone, tablet, smartwatch
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
    unique: true, // Código de identificação deve ser único
  },
  operatingSystem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Número de série deve ser único
  },
  purchaseDate: {
    type: DataTypes.DATEONLY, // Apenas a data, sem a hora
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
  timestamps: true, // Adiciona createdAt e updatedAt
});

module.exports = MobileDevice;