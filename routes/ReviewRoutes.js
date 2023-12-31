const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');
const ReviewController = require('../controllers/ReviewController');
const router = express.Router();

// Create a new review
router.post('/reviews', authenticateToken, authorizeRole(['employee', 'admin', 'client']), ReviewController.createReview);

// Get all reviews
router.get('/reviews', authenticateToken, authorizeRole(['admin']), ReviewController.getAllReviews);

// Get all reviews for a user
router.get('/reviews/user/:userId', authenticateToken, authorizeRole(['admin']), ReviewController.getReviewsForUser);

// Get a review by ID
router.get('/reviews/:reviewId', authenticateToken, authorizeRole(['admin']), ReviewController.getReviewById);

// Update a review
router.put('/reviews/:reviewId', authenticateToken, authorizeRole(['admin, client, employee']), ReviewController.updateReview);

// Delete a review
router.delete('/reviews/:reviewId', authenticateToken, authorizeRole(['admin']), ReviewController.deleteReview);

module.exports = router;