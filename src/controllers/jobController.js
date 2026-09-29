const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/jobs?keyword=&location=&type=&page=&limit=
const getJobs = asyncHandler(async (req, res) => {
  const { keyword, location, type } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const filter = { isActive: true };
  if (keyword) {
    const re = new RegExp(escapeRegex(String(keyword)), 'i');
    filter.$or = [{ title: re }, { company: re }, { description: re }];
  }
  if (location) filter.location = new RegExp(escapeRegex(String(location)), 'i');
  if (type) filter.type = String(type);

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Job.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: jobs.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: { jobs },
  });
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isActive: true });
  if (!job) throw new ApiError(404, 'Job not found');

  res.json({ success: true, data: { job } });
});

module.exports = { getJobs, getJobById };
