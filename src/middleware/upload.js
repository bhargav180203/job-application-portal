const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${ALLOWED_TYPES[file.mimetype]}`),
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
  cb(new ApiError(400, 'Only PDF, DOC and DOCX files are allowed'));
};

const maxMb = Number(process.env.MAX_FILE_SIZE_MB) || 2;

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxMb * 1024 * 1024 },
}).single('resume');

module.exports = { uploadResume, UPLOAD_DIR };
