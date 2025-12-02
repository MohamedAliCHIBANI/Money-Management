const mongoose = require('mongoose');
const Income = require('../models/income');

const {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getTotalIncomeCurrentMonth
} = require('../controllers/incomeController');

jest.mock('../models/income');


//
// ------------------------ GET ALL INCOMES ------------------------
//
describe('GET ALL INCOMES', () => {

  it('devrait retourner toutes les entrées pour l’utilisateur', async () => {

    Income.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { value: 100 },
        { value: 200 }
      ])
    });

    const req = {
      user: { id: 'user123' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAllIncomes(req, res);

    expect(Income.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });


  it('devrait retourner 500 si erreur Mongo', async () => {

    Income.find = jest.fn().mockImplementation(() => {
      throw new Error("DB error");
    });

    const req = { user: { id: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAllIncomes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});


//
// ------------------------ GET INCOME BY ID ------------------------
//
describe('GET INCOME BY ID', () => {

  it('devrait retourner un income s’il appartient à l’utilisateur', async () => {

    const userId = new mongoose.Types.ObjectId();

    Income.findById = jest.fn().mockResolvedValue({
      user: userId,
      value: 500
    });

    const req = {
      params: { id: 'income123' },
      user: { id: userId.toHexString() }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getIncomeById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });


  it('devrait retourner 404 si income inexistant', async () => {

    Income.findById = jest.fn().mockResolvedValue(null);

    const req = { params: { id: 'id123' }, user: { id: 'user1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getIncomeById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });


  it('devrait retourner 403 si income appartient à un autre utilisateur', async () => {

    const ownerId = new mongoose.Types.ObjectId();

    Income.findById = jest.fn().mockResolvedValue({
      user: ownerId,
      value: 100
    });

    const req = {
      params: { id: '123' },
      user: { id: new mongoose.Types.ObjectId().toHexString() }
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getIncomeById(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

});


//
// ------------------------ CREATE INCOME ------------------------
//
describe('CREATE INCOME', () => {

  it('devrait créer un income', async () => {

    Income.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ value: 100 })
    }));

    const req = {
      body: { value: 100 },
      user: { id: 'user1' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });


  it('devrait retourner 400 si erreur validation', async () => {

    Income.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Invalid'))
    }));

    const req = { body: {}, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});


//
// ------------------------ UPDATE INCOME ------------------------
//
describe('UPDATE INCOME', () => {

  it('devrait modifier un income appartenant au user', async () => {

    const userId = new mongoose.Types.ObjectId();

    const fakeIncome = {
      user: userId,
      value: 100,
      save: jest.fn().mockResolvedValue({ value: 200 })
    };

    Income.findById = jest.fn().mockResolvedValue(fakeIncome);

    const req = {
      params: { id: '123' },
      body: { value: 200 },
      user: { id: userId.toHexString() }
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });


  it('devrait retourner 403 si user non propriétaire', async () => {

    Income.findById = jest.fn().mockResolvedValue({
      user: new mongoose.Types.ObjectId(),
      save: jest.fn()
    });

    const req = { params: { id: '1' }, body: {}, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

});


//
// ------------------------ DELETE INCOME ------------------------
//
describe('DELETE INCOME', () => {

  it('devrait supprimer un income appartenant au user', async () => {

    const userId = new mongoose.Types.ObjectId();

    Income.findById = jest.fn().mockResolvedValue({
      user: userId,
      remove: jest.fn()
    });

    const req = {
      params: { id: '123' },
      user: { id: userId.toHexString() }
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });


  it('devrait retourner 404 si income absent', async () => {

    Income.findById = jest.fn().mockResolvedValue(null);

    const req = { params: { id: '123' }, user: { id: 'user1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteIncome(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});


//
// ------------------------ TOTAL INCOME CURRENT MONTH ------------------------
//
describe('TOTAL INCOME CURRENT MONTH', () => {

  it('devrait retourner le total du mois', async () => {

    const fakeTotal = 1000;

    Income.aggregate = jest.fn().mockResolvedValue([{ total: fakeTotal }]);

    const req = {
      user: { id: new mongoose.Types.ObjectId().toHexString() }
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getTotalIncomeCurrentMonth(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalIncome: fakeTotal });
  });


  it('devrait retourner 0 si aucune donnée', async () => {

    Income.aggregate = jest.fn().mockResolvedValue([]);

    const req = { user: { id: new mongoose.Types.ObjectId().toHexString() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getTotalIncomeCurrentMonth(req, res);

    expect(res.json).toHaveBeenCalledWith({ totalIncome: 0 });
  });

});
