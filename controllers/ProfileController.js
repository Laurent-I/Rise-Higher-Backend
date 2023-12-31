const profileService = require('../services/profile.service');
const { StatusCodes } = require('http-status-codes');


// Get All Profiles
const getAllProfiles = async (req, res)=>{
    try {
        const {q, page, limit, ...filterConditions} = req.query;
        const profiles = await profileService.getAllProfiles(q, filterConditions, parseInt(page), parseInt(limit));
        res.status(StatusCodes.OK).json({profiles});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Function to get a profile by ID
const getProfileById = async (req, res)=>{
    try {
        const {profileId} = req.params;
        const profile = await profileService.getProfileById(profileId);
        res.status(StatusCodes.OK).json({profile});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Function to create a profile
const createProfile = async (req, res)=>{
    try {
        const profileData = req.body;
        const userId = req.userId;
        const ProfileId = userId;
        
        //Add the file path to the profile data
        if(req.file){
            profileData.resume = req.file.path;
        }
        const profile = await profileService.createProfile(profileData, ProfileId);
        res.status(StatusCodes.CREATED).json({profile});
    } catch (error) {
        // console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Function to update a profile
const updateProfile = async (req, res)=>{
    try {
        const {profileId} = req.params;
        const profileData = req.body;

        //Add the file path to the profile data
        if(req.file){
            profileData.resume = req.file.path;
        }
        const updatedProfile = await profileService.updateProfile(profileId, profileData);
        res.status(StatusCodes.OK).json({updatedProfile});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}

// Function to delete a profile
const deleteProfile = async (req, res)=>{
    try {
        const {profileId} = req.params;
        const deletedProfile = await profileService.deleteProfile(profileId);
        res.status(StatusCodes.OK).json({deletedProfile});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}


module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
}