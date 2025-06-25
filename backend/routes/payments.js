const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

// @route   POST /api/payments/initiate
// @desc    Initiate a payment session
// @access  Private
router.post('/initiate', auth, initiatePayment);

// @route   POST /api/payments/verify
// @desc    Verify payment and update user account
// @access  Private
router.post('/verify', auth, verifyPayment);

module.exports = router; 