const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth'); // Import middleware
const router = express.Router();

// Get all users with authentication
//router.get('/users', authenticateToken, userController.getAllUsers);

// Add a new user
router.post('/add', userController.addUser);

// Get all users (alternative route)
router.get('/all', userController.getAllUsers);

// Get a user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/update/:id', userController.updateUser);

// Delete a user
router.delete('/delete/:id', userController.deleteUser);

// Login
router.post('/login', userController.loginUser);

module.exports = router;
