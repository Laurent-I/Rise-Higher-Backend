const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');

const JobController = require('../controllers/JobController');
const router = express.Router();

// Create a new job
router.post('/jobs', authenticateToken, authorizeRole(['client', 'admin']), JobController.createJob);

// Get all jobs
router.get('/jobs', authenticateToken, authorizeRole(['admin']), JobController.getAllJobs);

// Get a job by ID
router.get('/jobs/:jobId', authenticateToken, authorizeRole(['admin']), JobController.getJobById);

// Update a job
router.put('/jobs/:jobId', authenticateToken, authorizeRole(['client', 'admin']), JobController.updateJob);

// Apply for a job
router.post('/jobs/:jobId/apply', authenticateToken, authorizeRole(['employee', 'admin']), JobController.applyJob);

// Get all applicants for a job
router.get('/jobs/:jobId/applicants', authenticateToken, authorizeRole(['admin, client']), JobController.getApplicants);

// Delete a job
router.delete('/jobs/:jobId', authenticateToken, authorizeRole(['client', 'admin']), JobController.deleteJob);

module.exports = router;