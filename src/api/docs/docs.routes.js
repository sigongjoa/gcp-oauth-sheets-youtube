const express = require('express');
const docsController = require('./docs.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// All Docs routes require authentication
router.use(authenticate);

router.post('/', docsController.createDocument);
router.get('/:documentId', docsController.getDocumentContent);
router.post('/:documentId/batchUpdate', docsController.batchUpdateDocument);

module.exports = router;
