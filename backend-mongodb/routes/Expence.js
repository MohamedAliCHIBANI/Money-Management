const express = require('express');
const router = express.Router();
const expenceController = require('../controllers/expenceController');

router.post('/ajout', expenceController.addExpence);
router.get('/all', expenceController.getAllExpences);
router.get('/totalAmount/:category', expenceController.getTotalAmountByCategory);
router.get('/totalExpenses', expenceController.getTotalExpenses);

module.exports = router;
