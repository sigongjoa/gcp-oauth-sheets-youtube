const { google } = require('googleapis');
const oauth2Client = require('../../config/googleClient');
const { getTokensForUser } = require('../auth/auth.controller');
const multer = require('multer');
const stream = require('stream');

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get a configured Drive API client for a user
const getDriveClient = (userId) => {
  const tokens = getTokensForUser(userId);
  if (!tokens) {
    throw new Error('User not authenticated.');
  }
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: oauth2Client });
};

exports.uploadFile = [upload.single('file'), async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached by auth middleware
    if (!userId) {
      return res.status(401).send('Unauthorized: User ID not found.');
    }

    const drive = getDriveClient(userId);
    const fileMetadata = { name: req.file.originalname };

    // Create a readable stream from the buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,name,mimeType,webViewLink',
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send('Failed to upload file.');
  }
}];

exports.listFiles = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Unauthorized: User ID not found.');
    }

    const drive = getDriveClient(userId);
    const q = req.query.q || ''; // Search query parameter
    const pageSize = req.query.pageSize || 10; // Number of files to return

    const response = await drive.files.list({
      pageSize: pageSize,
      fields: 'nextPageToken, files(id, name, mimeType, webViewLink, createdTime)',
      q: q, // Apply search query
    });

    res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Error listing files:', error.message);
    res.status(500).send('Failed to list files.');
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Unauthorized: User ID not found.');
    }

    const drive = getDriveClient(userId);
    const fileId = req.params.fileId;

    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'stream' });

    response.data
      .on('end', () => {
        console.log('Done downloading file.');
      })
      .on('error', err => {
        console.error('Error during download', err);
        res.status(500).send('Failed to download file.');
      })
      .pipe(res);

  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).send('Failed to download file.');
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Unauthorized: User ID not found.');
    }

    const drive = getDriveClient(userId);
    const fileId = req.params.fileId;

    await drive.files.delete({ fileId: fileId });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).send('Failed to delete file.');
  }
};
