const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const resumeController = require('../controllers/resumeController');
const { useCredit } = require('../controllers/apiController');

// @route   POST /api/analyze-resume
// @desc    Analyze a resume (OpenAI)
// @access  Private
router.post('/analyze-resume', auth, resumeController.analyzeResume);

// @route   POST /api/generate-interview
// @desc    Generate interview questions (OpenAI)
// @access  Private
router.post('/generate-interview', auth, resumeController.generateInterview);

// @route   POST /api/credit/use
// @desc    Use a credit
// @access  Private
router.post('/credit/use', auth, useCredit);

module.exports = router; 