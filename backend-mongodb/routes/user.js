const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth'); // Import middleware
const router = express.Router();

const { getAllUsers } = require('../controllers/userController')
router.get('/users', authenticateToken, getAllUsers);

// Add a new user
router.post('/add', userController.addUser);

// Get all users
router.get('/all', userController.getAllUsers);

// Get a user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/update/:id', userController.updateUser);

// Delete a user
router.delete('/delete/:id', userController.deleteUser);

router.post('/login', userController.loginUser);

module.exports = router;
