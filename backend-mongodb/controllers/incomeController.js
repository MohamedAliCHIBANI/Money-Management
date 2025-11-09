// controllers/incomeController.js
const Income = require('../models/income');
const mongoose = require('mongoose');

// Get all incomes for authenticated user
exports.getAllIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single income by ID (only if belongs to authenticated user)
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new income for authenticated user
exports.createIncome = async (req, res) => {
  try {
    const income = new Income({
      user: req.user.id,        // <- important: set from req.user
      value: req.body.value,
      date: req.body.date || Date.now()
    });

    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an income by ID (only if belongs to authenticated user)
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (req.body.value != null) income.value = req.body.value;
    if (req.body.date != null) income.date = req.body.date;

    const updatedIncome = await income.save();
    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an income by ID (only if belongs to authenticated user)
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await income.remove();
    res.status(200).json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total income of the current month FOR THE AUTHENTICATED USER
exports.getTotalIncomeCurrentMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const agg = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" }
        }
      }
    ]);

    res.status(200).json({ totalIncome: agg[0] ? agg[0].total : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
