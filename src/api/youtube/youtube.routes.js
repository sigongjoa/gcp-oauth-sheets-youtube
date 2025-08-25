const express = require('express');
const youtubeController = require('./youtube.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// All YouTube routes require authentication
router.use(authenticate);

router.post('/upload', youtubeController.uploadVideo);
router.get('/videos', youtubeController.listVideos);
router.put('/videos/:videoId', youtubeController.updateVideo);
router.delete('/videos/:videoId', youtubeController.deleteVideo);
router.get('/videos/:videoId/analyze', youtubeController.analyzeVideo);

module.exports = router;
