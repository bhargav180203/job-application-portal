const router = require('express').Router();
const { getJobs, getJobById } = require('../controllers/jobController');
const { applyToJob } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam, applyRules } = require('../validators');

router.get('/', getJobs);
router.get('/:id', mongoIdParam, validate, getJobById);
router.post('/:id/apply', protect, applyRules, validate, applyToJob);

module.exports = router;
