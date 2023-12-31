const Job = require('../models/JobModel');
const User = require('../models/UserModel');

// Create a job
const createJob = async (jobData, createdBy) => {
  try {
    const job = new Job({
      ...jobData,
      createdBy
    });
    await job.save();

    //Update the user's createdJobs array
    await User.findByIdAndUpdate(createdBy, { $push: { createdJobs: job._id } });
    return job;
  } catch (error) {
    throw new Error('Failed to create job');
  }
};

// Get all jobs
const getAllJobs = async (role, userId, searchTerm, filterConditions, page, limit) => {
  try {
    let jobs;
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



    if (role === 'admin') {
      jobs = await Job.find(query).populate('createdBy', 'username')
    }else if(role === 'client'){
      jobs = await Job.find({createdBy: userId})
    }
    if (!jobs) {
      throw new Error('No jobs found');
    }
    return jobs;
  } catch (error) {
    if (error.message === 'No jobs found') {
      throw new Error('Failed to get jobs: No jobs found');
    }
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
    console.log(error)
    if (error.message === 'Job not found') {
      throw new Error('Job not found');
    }else{
    throw new Error('Failed to get job');
  }
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
    if (job.applicants.includes(userId)) {
      throw new Error('Already applied for this job');
    }
    job.applicants.push(userId);

    //Update the user's appliedJobs array

    await User.findByIdAndUpdate(userId, { $push: { applications: job._id } });
    await job.save();
    return job;
  } catch (error) {
    //console.log(error)
    if (error.message === 'Job not found') {
      throw new Error('Job not found');
    } else if (error.message === 'Already applied for this job') {
    throw new Error('Already applied for this job');
  }else{
    throw new Error('Failed to apply for job');}}

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