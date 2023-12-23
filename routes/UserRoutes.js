const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Register a new user
router.post('/register', UserController.registerUser);

// Login an existing user
router.post('/login', UserController.loginUser);

// Forgot password
router.post('/forgot-password', UserController.forgotPassword);

// Reset password
router.post('/reset-password', UserController.resetPassword);

// Route to get a user by ID
router.get('/users/:userId', UserController.loginUser, UserController.getUserById);

// Route to update a user
router.put('/users/:userId',  UserController.loginUser, UserController.updateUser);

// Route to delete a user
router.delete('/users/:userId', UserController.loginUser, UserController.deleteUser);

// Route to update a user's password
router.put('/users/:userId/password',  UserController.loginUser, UserController.updatePassword);

module.exports = router;