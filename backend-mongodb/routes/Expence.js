const express = require('express');
const router = express.Router();
const expenceController = require('../controllers/expenceController');
const { authenticateToken } = require('../middleware/auth');

router.post('/ajout', authenticateToken, expenceController.addExpence);
router.get('/all', authenticateToken, expenceController.getAllExpences);
router.get('/totalAmount/:category', authenticateToken, expenceController.getTotalAmountByCategory);
router.get('/totalExpenses', authenticateToken, expenceController.getTotalExpenses);

module.exports = router;
