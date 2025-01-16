const express = require('express');
const router = express.Router();
const Expence = require('../models/Expence');
const mongoose = require('mongoose');


router.post('/ajout', (req, res) => {
    let data = req.body;

    let expence = new Expence(data);

    expence.save()
        .then((saved) => {
            res.status(200).send(saved);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});
router.get('/all', (req, res) => {
    Expence.find({})
        .then(
            (expences) => {
                res.status(200).send(expences)
            }
        )
        .catch(
            (err) => {

                res.status(400).send(err)
            }
        )

})


router.get('/totalAmount/:category', (req, res) => {
    const { category } = req.params;

    Expence.aggregate([
        { $match: { category: category } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ])
    .then((result) => {
        if (result.length === 0) {
            return res.status(404).send('No expenses found for this category');
        }
        res.status(200).send({ totalAmount: result[0].totalAmount });
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/totalExpenses', (req, res) => {
    Expence.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ])
    .then((result) => {
        if (result.length === 0) {
            return res.status(404).send('No expenses found');
        }
        res.status(200).send({ totalAmount: result[0].totalAmount });
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;