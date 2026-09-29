const router = require('express').Router();
const { getMyApplications, getApplicationById } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

router.use(protect);
router.get('/', getMyApplications);
router.get('/:id', mongoIdParam, validate, getApplicationById);

module.exports = router;
