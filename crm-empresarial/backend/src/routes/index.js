const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const dealController = require('../controllers/dealController');
const taskController = require('../controllers/taskController');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);

router.get('/customers', customerController.getAll);
router.get('/customers/stats', customerController.getStats);
router.get('/customers/:id', customerController.getById);
router.post('/customers', customerController.create);
router.put('/customers/:id', customerController.update);
router.delete('/customers/:id', customerController.delete);

router.get('/deals', dealController.getAll);
router.get('/deals/pipeline', dealController.getPipeline);
router.get('/deals/stats', dealController.getStats);
router.get('/deals/:id', dealController.getById);
router.post('/deals', dealController.create);
router.put('/deals/:id', dealController.update);
router.delete('/deals/:id', dealController.delete);

router.get('/tasks', taskController.getAll);
router.get('/tasks/calendar', taskController.getCalendar);
router.get('/tasks/stats', taskController.getStats);
router.get('/tasks/:id', taskController.getById);
router.post('/tasks', taskController.create);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);

module.exports = router;
