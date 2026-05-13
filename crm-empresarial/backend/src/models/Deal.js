const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id',
    },
  },
  value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost'),
    defaultValue: 'prospect',
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100,
    },
  },
  expectedCloseDate: {
    type: DataTypes.DATEONLY,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'deals',
  timestamps: true,
});

module.exports = Deal;
