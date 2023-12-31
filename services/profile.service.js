const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

// Get All Profiles
// Get All Profiles with search, filter, and pagination
const getAllProfiles = async (searchTerm, filterConditions, page, limit) => {
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

    // Find profiles matching the query, populate 'userId', and apply pagination
    const profiles = await Profile.find(query)
      .populate('userId', 'username userId')
      .skip(skip)
      .limit(limit);

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
};

const getProfileById = async (profileId) => {
    try {
      const profile = await Profile.findById(profileId).populate('userId');
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error('Invalid profile ID');
      } else if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Failed to get profile: ${errorMessages.join(', ')}`);
      } else {
        throw new Error('Failed to get profile');
      }
    }
  };

// Function to create a profile
const createProfile = async (profileData, userId) => {
    try {
        // Check if the user already has a profile
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            throw new Error('Profile already exists');
        }
      const profile = await Profile.create({ ...profileData, userId });
      await User.findByIdAndUpdate(userId, {$push: {profileId: profile._id}})
      return profile;
    } catch (error) {
      console.log(error)
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Failed to create profile: ${errorMessages.join(', ')}`);
      } else if (error.message === 'Profile already exists') {
        throw new Error('Profile already exists');
      }else{
        throw new Error('Failed to create profile');
      }
    }
    }

// Function to update a profile
const updateProfile = async (profileId, profileData) => {
    try {
      const profile = await Profile.findByIdAndUpdate(profileId, profileData, { new: true });
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      if (error instanceof ValidationError) {
        const errorMessages = Object.values(error.errors).map((err) => err.message);
        throw new Error(`Failed to update profile: ${errorMessages.join(', ')}`);
      } else {
        throw new Error('Failed to update profile');
      }
    }
  };
  
  // Function to delete a profile
  const deleteProfile = async (profileId) => {
    try {
      const profile = await Profile.findByIdAndDelete(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      //  Remove the profileId from the user's profileId array
      await User.findByIdAndUpdate(profile.userId, { $pull: { profileId: profile._id } });
      return profile;
    } catch (error) {
      // console.log(error)
      if (error.name === 'CastError') {
        throw new Error('Invalid profile ID');
      } else if(error.message === 'Profile not found'){
        throw new Error('Profile not found');
      } {
        throw new Error('Failed to delete profile');
      }
    }
  };

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
};