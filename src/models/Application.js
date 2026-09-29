const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    // Snapshot of the resume used at the time of applying
    resume: {
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    coverLetter: { type: String, maxlength: 1000, trim: true },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

// A candidate can apply to a given job only once
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
