const Income = require('../models/income');

// Get all incomes
exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.status(200).json(incomes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single income by ID
exports.getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: 'Income not found' });
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new income
exports.createIncome = async (req, res) => {
    const income = new Income({
        value: req.body.value,
        date: req.body.date
    });

    try {
        const newIncome = await income.save();
        res.status(201).json(newIncome);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an income by ID
exports.updateIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: 'Income not found' });

        if (req.body.value != null) {
            income.value = req.body.value;
        }
        if (req.body.date != null) {
            income.date = req.body.date;
        }

        const updatedIncome = await income.save();
        res.status(200).json(updatedIncome);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an income by ID
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: 'Income not found' });

        await income.remove();
        res.status(200).json({ message: 'Income deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get total income of the current month
exports.getTotalIncomeCurrentMonth = async (req, res) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const totalIncome = await Income.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$value" }
                }
            }
        ]);

        res.status(200).json({ totalIncome: totalIncome[0] ? totalIncome[0].total : 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};