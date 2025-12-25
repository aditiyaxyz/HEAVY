const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

router.post('/register',
  limiter,
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  authController.register
);

router.get('/activate/:token', authController.activate);

router.post('/login',
  limiter,
  body('email').isEmail(),
  body('password').exists(),
  authController.login
);

router.post('/forgot', limiter, body('email').isEmail(), authController.forgotPassword);
router.post('/reset/:token', limiter, body('password').isLength({ min: 8 }), authController.resetPassword);

module.exports = router;
