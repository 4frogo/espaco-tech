const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'lead'),
    defaultValue: 'lead',
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'customers',
  timestamps: true,
});

module.exports = Customer;
