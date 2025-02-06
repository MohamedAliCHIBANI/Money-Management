const Expence = require('../models/expence');

exports.addExpence = async (req, res) => {
    try {
        const data = req.body;
        const expence = new Expence(data);
        const savedExpence = await expence.save();
        res.status(200).send(savedExpence);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getAllExpences = async (req, res) => {
    try {
        const expences = await Expence.find({});
        res.status(200).send(expences);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getTotalAmountByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const result = await Expence.aggregate([
            { $match: { category: category } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        if (result.length === 0) {
            return res.status(404).send('No expenses found for this category');
        }
        res.status(200).send({ totalAmount: result[0].totalAmount });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getTotalExpenses = async (req, res) => {
    try {
        const result = await Expence.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        if (result.length === 0) {
            return res.status(404).send('No expenses found');
        }
        res.status(200).send({ totalAmount: result[0].totalAmount });
    } catch (err) {
        res.status(400).send(err);
    }
};
