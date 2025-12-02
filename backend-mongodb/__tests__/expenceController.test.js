const mongoose = require('mongoose');
const {
  addExpence,
  getAllExpences,
  getTotalExpenses
} = require('../controllers/expenceController');

const Expence = require('../models/Expence');

// ✅ Mock global du modèle
jest.mock('../models/Expence');

//
// ------------------------ ADD EXPENSE UNIT TEST ------------------------
//
describe('ADD EXPENCE', () => {

  it('devrait créer une dépense avec user et date', async () => {

    Expence.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        category: "Food",
        description: "Pizza",
        amount: 20,
        user: "123",
        date: new Date()
      })
    }));

    const req = {
      body: {
        category: "Food",
        description: "Pizza",
        amount: 20
      },
      user: { id: '123' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await addExpence(req, res);

    expect(Expence).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });


  it('devrait retourner 400 en cas d’erreur', async () => {

    Expence.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Erreur DB"))
    }));

    const req = { body: {}, user: { id: '123' } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await addExpence(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});


//
// ------------------------ GET ALL EXPENCES ------------------------
//
describe('GET ALL EXPENCES', () => {

  it('devrait retourner toutes les dépenses de l’utilisateur', async () => {

    Expence.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { amount: 50 },
        { amount: 10 }
      ])
    });

    const req = {
      user: { id: 'abc123' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAllExpences(req, res);

    expect(Expence.find).toHaveBeenCalledWith({ user: 'abc123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});


//
// ------------------------ TOTAL EXPENCES ------------------------
//
describe('TOTAL EXPENCES', () => {

  it('devrait retourner la somme totale des montants', async () => {

    const fakeTotal = 300;

    Expence.aggregate = jest.fn().mockResolvedValue([
      { totalAmount: fakeTotal }
    ]);

    // ✅ ObjectId valide
    const req = {
      user: { id: new mongoose.Types.ObjectId().toHexString() }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getTotalExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalAmount: fakeTotal });
  });

});
