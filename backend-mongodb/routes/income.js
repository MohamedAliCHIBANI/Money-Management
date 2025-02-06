const express = require('express');
const incomeController = require('../controllers/incomeController');

const router = express.Router();

// Get all incomes
router.get('/All', incomeController.getAllIncomes);
// Get total income for the current month
router.get('/TotalIncomeCurrentMonth', incomeController.getTotalIncomeCurrentMonth);

// Get a single income by ID
router.get('/:id', incomeController.getIncomeById);

// Create a new income
router.post('/Add', incomeController.createIncome);

// Update an income by ID
router.put('/:id', incomeController.updateIncome);

// Delete an income by ID
router.delete('/:id', incomeController.deleteIncome);


module.exports = router;