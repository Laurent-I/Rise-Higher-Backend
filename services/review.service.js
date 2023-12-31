const Review = require('../models/ReviewModel');
const User = require('../models/UserModel');

// Create a new review
const createReview = async (reviewData, reviewerId) => {
    try {
        const review = new Review({...reviewData, reviewer: reviewerId});

        // Update the user's reviews array if he is being reviewed and in the reviewed array if he is the reviewer
        
        await review.save();
        await User.findByIdAndUpdate(review.reviewer, { $push: { reviewed: review._id } });
        await User.findByIdAndUpdate(review.reviewee, { $push: { reviews: review._id } });
        return review;
    } catch (error) {
        if(error.name === 'ValidationError'){
            throw new Error('Validation error:' + error.message);
        }
        throw new Error('Failed to create review'); 
    }
}

// Get all reviews
const getAllReviews = async () => {
    try {
        const reviews = await Review.find().populate('reviewer', 'username').populate('reviewee', 'username');
        return reviews;
    } catch (error) {
        throw new Error('Failed to get reviews');
    }
}

// Get all reviews for a user
const getReviewsForUser = async (userId) => {
    try {
        const reviews = await Review.find({reviewee: userId}).populate('reviewer', 'username');
        return reviews;
    } catch (error) {
        throw new Error('Failed to get reviews');
    }
}

// Get a review by ID
const getReviewById = async (reviewId) => {
    try {
        const review = await Review.findById({_id: reviewId}).populate('reviewer', 'username').populate('reviewee', 'username');
        if(!review){
            throw new Error('Review not found');
        }
        return review;
    } catch (error) {
        if(error.message === 'Review not found'){
            throw new Error('Review not found');
        }
        throw new Error('Failed to get review');
    }
}

const updateReview = async (reviewId, updatedReviewData, reviewerId) => {
    try {
        // Remove the reviewer field from the updatedReviewData object
        const { reviewer, ...reviewDataWithoutReviewer } = updatedReviewData;

        // Find the review by reviewId and reviewerId to ensure that only the reviewer can update the review
        const review = await Review.findOneAndUpdate({ _id: reviewId, reviewer: reviewerId }, reviewDataWithoutReviewer, { new: true });

        if (!review) {
            throw new Error('Review not found or you are not the reviewer');
        }

        return review;
    } catch (error) {
        if (error.message === 'Review not found or you are not the reviewer') {
            throw new Error('Review not found or you are not the reviewer');
        }
        throw new Error('Failed to update review');
    }
}

// Delete a review
const deleteReview = async (reviewId, reviewerId) => {
    try {
        const review = await Review.findByIdAndDelete({ _id: reviewId , reviewer: reviewerId});

        //Clean up the review from the Reviews Array and in the reviewed array in the User model
        await User.findByIdAndUpdate(review.reviewer, { $pull: { reviewed: review._id } });
        await User.findByIdAndUpdate(review.reviewee, { $pull: { reviews: review._id } });
        if(!review){
            throw new Error('Review not found or you are not the reviewer');
        }
        return review;
    } catch (error) {
        if(error.message === 'Review not found or you are not the reviewer'){
            throw new Error('Review not found or you are not the reviewer');
        }
        throw new Error('Failed to delete review');
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