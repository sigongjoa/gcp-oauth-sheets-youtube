const express = require('express');
const driveController = require('./drive.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// All Drive routes require authentication
router.use(authenticate);

router.post('/upload', driveController.uploadFile);
router.get('/files', driveController.listFiles);
router.get('/files/:fileId/download', driveController.downloadFile);
router.delete('/files/:fileId', driveController.deleteFile);

module.exports = router;
