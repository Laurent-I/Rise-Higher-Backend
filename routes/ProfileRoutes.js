const express = require('express');
const { authenticateToken } = require('../middleware/AuthMiddleware');
const ProfileController = require('../controllers/ProfileController');
const router = express.Router();

// Create a new profile
router.post('/profile', authenticateToken, ProfileController.createProfile);

// Get all profiles
router.get('/profiles', authenticateToken, ProfileController.getAllProfiles);

// Get a profile by ID
router.get('/profiles/:profileId', authenticateToken, ProfileController.getProfileById);

// Update a profile
router.put('/profiles/:profileId', authenticateToken, ProfileController.updateProfile);

// Delete a profile
router.delete('/profiles/:profileId', authenticateToken, ProfileController.deleteProfile);

module.exports = router;