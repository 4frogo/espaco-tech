const sequelize = require('../config/database');
const Customer = require('./Customer');
const Deal = require('./Deal');
const Task = require('./Task');

Customer.hasMany(Deal, { foreignKey: 'customerId' });
Deal.belongsTo(Customer, { foreignKey: 'customerId' });

Task.belongsTo(Customer, { foreignKey: 'customerId' });
Task.belongsTo(Deal, { foreignKey: 'dealId' });

module.exports = {
  sequelize,
  Customer,
  Deal,
  Task,
};
