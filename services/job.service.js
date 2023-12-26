const Job = require('../models/JobModel');

// Create a job
const createJob = async (jobData, createdBy) => {
  try {
    const job = new Job({
      ...jobData,
      createdBy
    });
    await job.save();
    return job;
  } catch (error) {
    throw new Error('Failed to create job');
  }
};

// Get all jobs
const getAllJobs = async () => {
  try {
    const jobs = await Job.find();
    return jobs;
  } catch (error) {
    throw new Error('Failed to get jobs');
  }
};

// Get a single job by ID
const getJobById = async (jobId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    throw new Error('Failed to get job');
  }
};

// Update a job
const updateJob = async (jobId, updatedData) => {
  try {
    const job = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    throw new Error('Failed to update job');
  }
};

//Apply for a job
const applyJob = async (jobId, userId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    job.applicants.push(userId);
    await job.save();
    return job;
  } catch (error) {
    throw new Error('Failed to apply for job');
  }

}

// Get all applicants for a job
const getApplicants = async (jobId) => {
  try {
    const job = await Job.findById(jobId).populate('applicants');
    if (!job) {
      throw new Error('Job not found');
    }
    return job.applicants;
  } catch (error) {
    throw new Error('Failed to get applicants');
  }
};

// Delete a job
const deleteJob = async (jobId) => {
  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    throw new Error('Failed to delete job');
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  applyJob,
  getApplicants,
  deleteJob
};