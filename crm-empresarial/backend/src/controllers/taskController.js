const { Task, Customer, Deal } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { status, priority, type, customerId } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (type) {
      where.type = type;
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Customer, as: 'customer' },
        { model: Deal, as: 'deal' },
      ],
      order: [['dueDate', 'ASC']],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: ['customer', 'deal'],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCalendar = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = {};

    if (start && end) {
      where.dueDate = {
        $between: [start, end],
      };
    }

    const tasks = await Task.findAll({
      where,
      include: ['customer', 'deal'],
      order: [['dueDate', 'ASC']],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Task.count();
    const byStatus = await Task.count({ group: 'status' });
    const byPriority = await Task.count({ group: 'priority' });
    const byType = await Task.count({ group: 'type' });
    const overdue = await Task.count({
      where: {
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      },
    });

    res.json({
      total,
      byStatus,
      byPriority,
      byType,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
