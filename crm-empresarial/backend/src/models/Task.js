const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  type: {
    type: DataTypes.ENUM('call', 'email', 'meeting', 'followup', 'other'),
    defaultValue: 'other',
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'customers',
      key: 'id',
    },
  },
  dealId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'deals',
      key: 'id',
    },
  },
  assignedTo: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
