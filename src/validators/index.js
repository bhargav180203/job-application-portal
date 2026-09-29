const { body, param } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name is too long'),
  body('email').trim().toLowerCase().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const mongoIdParam = [param('id').isMongoId().withMessage('Invalid id')];

const applyRules = [
  ...mongoIdParam,
  body('coverLetter').optional().isString().isLength({ max: 1000 }).withMessage('Cover letter must be at most 1000 characters'),
];

module.exports = { registerRules, loginRules, mongoIdParam, applyRules };
