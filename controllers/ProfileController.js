const profileService = require('../services/profile.service');
const multer = require('multer');
const { StatusCodes } = require('http-status-codes');


// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/resume');
    },
    filename: function(req, file, cb){
        console.log(file)
        cb(null, Date.now() + file.originalname);
    }
})

// Define file filter
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'application/pdf'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// Define file size
const fileSize = 1024 * 1024 * 5; // 5MB

// Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: fileSize},
    fileFilter: fileFilter
}).single('resume');

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
        // const profileData.resume = req.file.path;
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
    upload
}