const Job = require('../models/Job');
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const JOB_FIELDS = 'title company location type salary';

// POST /api/jobs/:id/apply
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isActive: true });
  if (!job) throw new ApiError(404, 'Job not found');

  const resume = req.user.resume;
  if (!resume || !resume.filename) {
    throw new ApiError(400, 'Please upload your resume first (POST /api/resume) before applying');
  }

  if (await Application.findOne({ user: req.user._id, job: job._id })) {
    throw new ApiError(409, 'You have already applied for this job');
  }

  const application = await Application.create({
    user: req.user._id,
    job: job._id,
    resume: { filename: resume.filename, originalName: resume.originalName },
    coverLetter: req.body.coverLetter,
  });
  await application.populate('job', JOB_FIELDS);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application },
  });
});

// GET /api/applications
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate('job', JOB_FIELDS)
    .sort({ createdAt: -1 });

  res.json({ success: true, count: applications.length, data: { applications } });
});

// GET /api/applications/:id
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, user: req.user._id }).populate('job', JOB_FIELDS);
  if (!application) throw new ApiError(404, 'Application not found');

  res.json({ success: true, data: { application } });
});

module.exports = { applyToJob, getMyApplications, getApplicationById };
