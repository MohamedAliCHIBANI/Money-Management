const User = require('../models/user');
const bcrypt = require('bcrypt');


// Add a new user
exports.addUser = async (req, res) => {
    try {
        const { username, password, status, card } = req.body;

        // Validate input
        if (!username || !password || !card) {
            return res.status(400).send('Username, password, and card information are required.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword, // Store the hashed password
            status: status || 'Active',
            card,
        });

        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        // If password is being updated, hash it
        if (updatedData.password) {
            const saltRounds = 10;
            updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully');
    } catch (err) {
        res.status(400).send(err);
    }
};

const jwt = require('jsonwebtoken'); // Import JWT library
const SECRET_KEY = '123456789'; // Replace with your own secret key

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).send('Username and password are required.');
        }

        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid password');
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login successful', token });
    } catch (err) {
        res.status(400).send(err);
    }
};
