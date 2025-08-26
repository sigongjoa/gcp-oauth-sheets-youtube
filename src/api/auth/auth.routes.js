const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// A simple success page for redirect after authentication
router.get('/success', (req, res) => {
  res.send('Authentication successful! You can close this tab and return to the application.');
});

const authenticate = require('../../middleware/auth'); // Import authenticate middleware
router.get('/status', authenticate, authController.checkAuthStatus);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
