const { Customer, Deal, Task, sequelize } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const customers = await Customer.count();
    const activeCustomers = await Customer.count({
      where: { status: 'active' },
    });
    const leads = await Customer.count({
      where: { status: 'lead' },
    });

    const deals = await Deal.count();
    const wonDeals = await Deal.count({
      where: { stage: 'won' },
    });
    const pipelineValue = await Deal.sum('value', {
      where: { stage: { $in: ['proposal', 'negotiation'] } },
    }) || 0;
    const wonValue = await Deal.sum('value', {
      where: { stage: 'won' },
    }) || 0;

    const tasks = await Task.count();
    const pendingTasks = await Task.count({
      where: { status: { $in: ['pending', 'in_progress'] } },
    });
    const overdueTasks = await Task.count({
      where: {
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      },
    });

    const recentDeals = await Deal.findAll({
      limit: 5,
      include: ['customer'],
      order: [['createdAt', 'DESC']],
    });

    const upcomingTasks = await Task.findAll({
      where: {
        status: { $ne: 'completed' },
        dueDate: { $gte: new Date() },
      },
      include: ['customer', 'deal'],
      limit: 5,
      order: [['dueDate', 'ASC']],
    });

    const dealsByStage = await Deal.findAll({
      attributes: [
        'stage',
        [sequelize.fn('COUNT', sequelize.col('Deal.id')), 'count'],
      ],
      group: ['stage'],
      raw: true,
    });

    res.json({
      customers: {
        total: customers,
        active: activeCustomers,
        leads,
      },
      deals: {
        total: deals,
        won: wonDeals,
        pipelineValue: parseFloat(pipelineValue),
        wonValue: parseFloat(wonValue),
      },
      tasks: {
        total: tasks,
        pending: pendingTasks,
        overdue: overdueTasks,
      },
      recentDeals,
      upcomingTasks,
      dealsByStage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
