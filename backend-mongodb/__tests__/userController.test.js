const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/userController');

jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

//
// ------------------------ ADD USER ------------------------
//
describe('ADD USER', () => {

  it('devrait créer un utilisateur avec mot de passe hashé', async () => {

    bcrypt.hash.mockResolvedValue('hashedPassword');

    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
        status: 'Active',
        card: '1234'
      })
    }));

    const req = {
      body: { username: 'testuser', password: 'pass', card: '1234' }
    };

    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await addUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'testuser' })
    );
  });

  it('devrait retourner 400 si données manquantes', async () => {

    const req = { body: { username: '', password: '', card: '' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});

//
// ------------------------ GET ALL USERS ------------------------
//
describe('GET ALL USERS', () => {

  it('devrait retourner tous les utilisateurs', async () => {

    User.find.mockResolvedValue([{ username: 'user1' }, { username: 'user2' }]);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      expect.arrayContaining([{ username: 'user1' }])
    );
  });

  it('devrait retourner 400 si erreur Mongo', async () => {
    User.find.mockRejectedValue(new Error('DB Error'));

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});

//
// ------------------------ GET USER BY ID ------------------------
//
describe('GET USER BY ID', () => {

  it('devrait retourner un utilisateur existant', async () => {
    User.findById.mockResolvedValue({ username: 'user1' });

    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ username: 'user1' });
  });

  it('devrait retourner 404 si utilisateur inexistant', async () => {
    User.findById.mockResolvedValue(null);

    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});

//
// ------------------------ UPDATE USER ------------------------
//
describe('UPDATE USER', () => {

  it('devrait mettre à jour un utilisateur avec hash du mot de passe', async () => {
    bcrypt.hash.mockResolvedValue('hashedPass');

    User.findByIdAndUpdate.mockResolvedValue({
      username: 'user1',
      password: 'hashedPass'
    });

    const req = { params: { id: '123' }, body: { password: 'newpass' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await updateUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('devrait retourner 404 si utilisateur absent', async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: '123' }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});

//
// ------------------------ DELETE USER ------------------------
//
describe('DELETE USER', () => {

  it('devrait supprimer un utilisateur existant', async () => {
    User.findByIdAndDelete.mockResolvedValue({ username: 'user1' });

    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('devrait retourner 404 si utilisateur absent', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});

//
// ------------------------ LOGIN USER ------------------------
//
describe('LOGIN USER', () => {

  it('devrait connecter l’utilisateur et générer un token', async () => {
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fakeToken');

    User.findOne.mockResolvedValue({
      _id: '123',
      username: 'user1',
      password: 'hashed'
    });

    const req = { body: { username: 'user1', password: 'pass' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await loginUser(req, res);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'fakeToken' })
    );
  });

  it('devrait retourner 404 si utilisateur non trouvé', async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { username: 'user1', password: 'pass' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devrait retourner 401 si mot de passe invalide', async () => {
    User.findOne.mockResolvedValue({ password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { username: 'user1', password: 'wrong' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

});
