const express = require('express');
const { authenticateToken } = require('../middleware/AuthMiddleware');
const UserController = require('../controllers/UserController');
const router = express.Router();

// Register a new user
router.post('/register', UserController.registerUser);

// Login an existing user
router.post('/login', UserController.loginUser);

// Forgot password
router.post('/forgot-password', UserController.forgotPassword);

// Reset password
router.post('/reset-password', UserController.resetPassword);

// Protected route that requires authentication
router.get('/users/:userId', authenticateToken, UserController.getUserById);

// Protected route that requires authentication
router.put('/users/:userId', authenticateToken, UserController.updateUser);

// Protected route that requires authentication
router.delete('/users/:userId', authenticateToken, UserController.deleteUser);

// Protected route that requires authentication
router.put('/users/:userId/password', authenticateToken, UserController.updatePassword);


module.exports = router;