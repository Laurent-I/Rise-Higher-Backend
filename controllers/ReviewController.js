const {StatusCodes} = require('http-status-codes');
const reviewService = require('../services/review.service');

// Create a new review
const createReview = async(req, res)=> {
    try {
        const reviewData = req.body;
        const reviewerId = req.userId;
        const review = await reviewService.createReview(reviewData, reviewerId);
        res.status(StatusCodes.CREATED).json({review});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Get all reviews
const getAllReviews = async(req, res)=> {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(StatusCodes.OK).json({reviews});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Get all reviews for a user
const getReviewsForUser = async(req, res)=> {
    try {
        const {userId} = req.params;
        const reviews = await reviewService.getReviewsForUser(userId);
        res.status(StatusCodes.OK).json({reviews});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Get a review by ID
const getReviewById = async(req, res)=> {
    try {
        const {reviewId} = req.params;
        const review = await reviewService.getReviewById(reviewId);
        res.status(StatusCodes.OK).json({review});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Update a review
const updateReview = async(req, res)=> {
    try {
        const {reviewId} = req.params;
        const reviewerId = req.userId;
        const reviewData = req.body;
        const review = await reviewService.updateReview(reviewId, reviewData, reviewerId);
        res.status(StatusCodes.OK).json({review});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Delete a review
const deleteReview = async(req, res)=> {
    try {
        const {reviewId} = req.params;
        const reviewerId = req.userId;
        const deletedReview = await reviewService.deleteReview(reviewId, reviewerId);
        res.status(StatusCodes.OK).json({deletedReview});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewsForUser,
    getReviewById,
    updateReview,
    deleteReview
}