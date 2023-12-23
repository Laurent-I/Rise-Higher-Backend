const User = require('../models/User');

// Function to get a user by ID
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Failed to get user');
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
        throw new Error('Failed to update user');
    }
};

// Function to delete a user
const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};

// Function to update a user's password
const updatePassword = async (userId, currentPassword, newPassword) => {
    try {
      // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

      // Check if the provided current password matches the user's actual password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new Error('Incorrect current password');
    }

      // Update the user's password
    user.password = newPassword;
    await user.save();

    return user;
    } catch (error) {
    throw new Error('Failed to update password');
    }
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    updatePassword
};