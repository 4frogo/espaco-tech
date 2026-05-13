const { Customer, Deal, Task } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.$or = [
        { name: { $iLike: `%${search}%` } },
        { email: { $iLike: `%${search}%` } },
        { company: { $iLike: `%${search}%` } },
      ];
    }

    const customers = await Customer.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    const customersWithRelations = await Promise.all(customers.map(async (customer) => {
      const deals = await Deal.findAll({ where: { customerId: customer.id } });
      const tasks = await Task.findAll({ where: { customerId: customer.id } });
      return {
        ...customer.toJSON(),
        tags: JSON.parse(customer.tags || '[]'),
        Deals: deals,
        Tasks: tasks,
      };
    }));

    res.json(customersWithRelations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const deals = await Deal.findAll({ where: { customerId: customer.id } });
    const tasks = await Task.findAll({ where: { customerId: customer.id } });

    res.json({
      ...customer.toJSON(),
      tags: JSON.parse(customer.tags || '[]'),
      Deals: deals,
      Tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const customer = await Customer.create({
      ...rest,
      tags: tags ? JSON.stringify(tags) : '[]',
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const { tags, ...rest } = req.body;
    await customer.update({
      ...rest,
      tags: tags ? JSON.stringify(tags) : customer.tags,
    });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Customer.count();
    const byStatus = await Customer.count({ group: 'status' });
    const recent = await Customer.count({
      where: {
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.json({
      total,
      byStatus,
      recent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
