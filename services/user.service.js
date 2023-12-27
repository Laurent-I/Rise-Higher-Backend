const User = require('../models/UserModel');

// Get All Users
const getAllUsers = async () => {
    try {
        const users = await User.find({}).populate('createdJobs', { 'title': 1, 'description': 1 }).populate('profileId', { 'firstName': 1, 'lastName': 1, })
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
        const user = await User.findByIdAndDelete(userId);
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