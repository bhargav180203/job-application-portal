const router = require('express').Router();
const { uploadResume, getResume, downloadResume } = require('../controllers/resumeController');
const { uploadResume: uploadMiddleware } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.use(protect); // every resume route needs a logged-in user
router.post('/', uploadMiddleware, uploadResume);
router.get('/', getResume);
router.get('/download', downloadResume);

module.exports = router;
