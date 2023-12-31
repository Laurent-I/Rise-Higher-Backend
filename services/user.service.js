const User = require('../models/UserModel');
const Profile = require('../models/ProfileModel');
const Job = require('../models/JobModel');

// Get All Users with search, filter, and pagination
const getAllUsers = async (searchTerm, filterConditions, page, limit) => {
    try {
        // Create a query object
        let query = {};

        // Add search term to query if it exists
        if (searchTerm) {
            query.$text = { $search: searchTerm };
        }

        // Add filter conditions to query if they exist
        if (filterConditions) {
            query = { ...query, ...filterConditions };
        }

        // Calculate the number of documents to skip for pagination
        const skip = page > 0 ? (page - 1) * limit : 0;

        // Find users matching the query, populate 'createdJobs', and apply pagination
        const users = await User.find(query)
            .populate('createdJobs', { 'title': 1, 'description': 1 })
            .skip(skip)
            .limit(limit);

        if (!users) {
            throw new Error('No users found');
        }

        return users;
    } catch (error) {
        console.log(error)
        if (error.message === 'No users found') {
            throw new Error('Failed to get users: No users found');
        }
        throw new Error('Failed to get users');
    }
};

// Function to get a user by ID
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        if(error.message === 'User not found'){
            throw new Error('Failed to delete user: User not found')
        }else{
        throw new Error('Failed to delete user');
        }
    }
};

// Function to update a user
const updateUser = async (userId, userData) => {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        if(error.message === 'User not found'){
            throw new Error('Failed to delete user: User not found')
        }else{
        throw new Error('Failed to delete user');
        }
    }
};

// Function to delete a user
const deleteUser = async (userId) => {
    try {
        // Delete the user's profile
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await Profile.findByIdAndDelete(user.profileId);

        // Delete the user's jobs
        await Job.deleteMany({ createdBy: userId });

        // Delete the user's applications
        await Job.updateMany({ applicants: userId }, { $pull: { applicants: userId } });

        await User.findByIdAndDelete(userId);

        return user;
    } catch (error) {
        console.log(error);
        if (error.message === 'User not found') {
            throw new Error('Failed to delete user: User not found');
        } else {
            throw new Error('Failed to delete user');
        }
    }
};

// Function to update a user's password
const updatePassword = async (userId, currentPassword, newPassword) => {
    try {
      // Find the user by ID
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
        throw new Error('User not found');
    }

      // Check if the provided current password matches the user's actual password
    const isMatch = await user.comparePassword(currentPassword);
    console.log(isMatch)
    if (!isMatch) {
        throw new Error('Incorrect current password');
    }

      // Update the user's password
    user.password = newPassword;
    await user.save();

    return user;
    } catch (error) {
        if (error.message === 'User not found') {
          throw new Error('Failed to update password: User not found');
        } else if (error.message === 'Incorrect current password') {
          throw new Error('Failed to update password: Incorrect current password');
        } else {
          throw new Error('Failed to update password');
        }
      }
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    updatePassword,
    getAllUsers
};