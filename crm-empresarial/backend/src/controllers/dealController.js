const { Deal, Customer } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { stage, customerId } = req.query;
    const where = {};

    if (stage) {
      where.stage = stage;
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    const deals = await Deal.findAll({
      where,
      include: [{ model: Customer, as: 'customer' }],
      order: [['createdAt', 'DESC']],
    });

    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }],
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json(deal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.update(req.body);
    res.json(deal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.destroy();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPipeline = async (req, res) => {
  try {
    const pipeline = await Deal.findAll({
      attributes: [
        'stage',
        [sequelize.fn('COUNT', sequelize.col('Deal.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('Deal.value')), 'total_value'],
      ],
      group: ['stage'],
      raw: true,
    });

    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Deal.count();
    const byStage = await Deal.count({ group: 'stage' });
    const totalValue = await Deal.sum('value', { where: { stage: 'won' } }) || 0;
    const expectedValue = await Deal.sum('value', {
      where: { stage: { $ne: 'lost' } },
    }) || 0;

    res.json({
      total,
      byStage,
      totalValue: parseFloat(totalValue),
      expectedValue: parseFloat(expectedValue),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
