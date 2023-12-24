const Profile = require('../models/ProfileModel');

// Get All Profiles
const getAllProfiles = async () => {
    try {
        const profiles = await Profile.find({}).populate('userId');
        if (!profiles) {
            throw new Error('No profiles found');
        }
        return profiles;
    } catch (error) {
        if (error.message === 'No profiles found'){
            throw new Error('Failed to get profiles: No profiles found');
        }
        throw new Error('Failed to get profiles');
    }
}

// Function to get a profile by ID
const getProfileById = async (profileId) => {
    try {
        const profile = await Profile.findById(profileId).populate('userId');
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    } catch (error) {
        if(error.message === 'Profile not found'){
            throw new Error('Failed to delete profile: Profile not found')
        
    }else{
        throw new Error('Failed to delete profile');
        }
    }
};

// Function to create a profile
const createProfile = async (profileData, userId) => {
    try {
        const profile = await Profile.create({ ...profileData, userId });
        if (!profile) {
            throw new Error('Profile not created');
        }
        return profile;
    } catch (error) {
        if(error.message === 'Profile not created'){
            throw new Error('Failed to create profile: Profile not created')
        }else{
        throw new Error('Failed to create profile');
    }
    }
};

// Function to update a profile
const updateProfile = async (profileId, profileData) => {
    try {
        const profile = await Profile.findByIdAndUpdate(profileId, profileData, { new: true });
        if (!profile) {
            throw new Error('Profile not found');
        }
    } catch (error) {
        if(error.message === 'Profile not found'){
            throw new Error('Failed to update profile: Profile not found')
        }else{
        throw new Error('Failed to update profile');
        }
    }
}

// Function to delete a profile
const deleteProfile = async (profileId) => {
    try {
        const profile = await Profile.findByIdAndDelete(profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    } catch (error) {
        if(error.message === 'Profile not found'){
            throw new Error('Failed to delete profile: Profile not found')
        }else{
        throw new Error('Failed to delete profile');
        }
    }
}

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
};