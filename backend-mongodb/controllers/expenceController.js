  // controllers/expenceController.js
  const Expence = require('../models/Expence'); // si ton fichier modèle s'appelle Expence.js, garde ce require
  const mongoose = require('mongoose');
  

  // Create expense for authenticated user
  exports.addExpence = async (req, res) => {
    try {
      const data = {
        ...req.body,
        user: req.user.id,           // <- important: always set user from authenticated user
        date: req.body.date || Date.now()
      };
      const expence = new Expence(data);
      const savedExpence = await expence.save();
      res.status(201).json(savedExpence);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Get all expenses for authenticated user
  exports.getAllExpences = async (req, res) => {
    try {
      const expences = await Expence.find({ user: req.user.id }).sort({ date: -1 });
      res.status(200).json(expences);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Get total amount by category for authenticated user
  exports.getTotalAmountByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const result = await Expence.aggregate([
        { $match: { category: new RegExp(`^${category}$`, 'i'), user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      res.status(200).json({ totalAmount: result[0] ? result[0].totalAmount : 0 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Get total expenses for authenticated user
  exports.getTotalExpenses = async (req, res) => {
    try {
      const result = await Expence.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      res.status(200).json({ totalAmount: result[0] ? result[0].totalAmount : 0 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
