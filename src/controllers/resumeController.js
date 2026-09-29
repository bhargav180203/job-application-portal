const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { UPLOAD_DIR } = require('../middleware/upload');

// POST /api/resume  (form-data, key: resume)
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please attach a resume file using the form-data key "resume"');
  }

  const resume = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date(),
  };

  await User.findByIdAndUpdate(req.user._id, { resume });

  res.status(201).json({ success: true, message: 'Resume uploaded successfully', data: { resume } });
});

// GET /api/resume  (metadata of the current user's resume)
const getResume = asyncHandler(async (req, res) => {
  if (!req.user.resume || !req.user.resume.filename) {
    throw new ApiError(404, 'No resume uploaded yet');
  }
  res.json({ success: true, data: { resume: req.user.resume } });
});

// GET /api/resume/download
const downloadResume = asyncHandler(async (req, res) => {
  const resume = req.user.resume;
  if (!resume || !resume.filename) throw new ApiError(404, 'No resume uploaded yet');

  const filePath = path.join(UPLOAD_DIR, path.basename(resume.filename));
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'Resume file not found on server. Please upload it again');
  }
  res.download(filePath, resume.originalName);
});

module.exports = { uploadResume, getResume, downloadResume };
