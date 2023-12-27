const { StatusCodes } = require('http-status-codes');
const jobService = require('../services/JobService');

// Create a new job
const createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const createdBy = req.user._id;
        const job = await jobService.createJob(jobData, createdBy);
        res.status(StatusCodes.CREATED).json({ job });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create job' });
    }
}

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(StatusCodes.OK).json({ jobs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get jobs' });
    }
}

// Get a single job by ID
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await jobService.getJobById(jobId);
        res.status(StatusCodes.OK).json({ job });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get job' });
    }
}

// Update a job
const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const updatedData = req.body;
        const job = await jobService.updateJob(jobId, updatedData);
        res.status(StatusCodes.OK).json({ job });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update job' });
    }
}

// Apply for a job
const applyJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;
        const job = await jobService.applyJob(jobId, userId);
        res.status(StatusCodes.OK).json({ job });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to apply for job' });
    }
}

// Get all applicants for a job
const getApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applicants = await jobService.getApplicants(jobId);
        res.status(StatusCodes.OK).json({ applicants });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get applicants' });
    }
}

// Delete a job
const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const deletedJob = await jobService.deleteJob(jobId);
        res.status(StatusCodes.OK).json({ deletedJob });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete job' });
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    applyJob,
    getApplicants
}