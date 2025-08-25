const oauth2Client = require('../../config/googleClient');
const { google } = require('googleapis');

// In a real application, you would store tokens securely (e.g., in a database)
// For this example, we'll use a simple in-memory store for demonstration purposes.
const tokensStore = {}; // userId: { access_token, refresh_token, expiry_date }

exports.googleAuth = (req, res) => {
  const defaultScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents',
  ];

  // Get scopes from query parameter, e.g., ?scopes=drive.file,sheets.readonly
  const requestedScopes = req.query.scopes ? req.query.scopes.split(',').map(s => `https://www.googleapis.com/auth/${s.trim()}`) : [];

  const scopes = [...new Set([...defaultScopes, ...requestedScopes])];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Always ask for consent to ensure refresh token is granted
  });

  res.redirect(authUrl);
};

exports.googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // In a real app, you'd identify the user and store these tokens securely.
    // For simplicity, we'll just store them in a global object for now.
    // You might want to associate these tokens with a session or user ID.
    const userId = 'demoUser'; // Replace with actual user identification
    tokensStore[userId] = tokens;

    console.log('Tokens received and stored:', tokens);

    // Redirect to the frontend application's base URL
    res.redirect('http://localhost:5174/'); // Assuming frontend runs on 5174
  } catch (error) {
    console.error('Error retrieving access token:', error.message);
    res.status(500).send('Authentication failed');
  }
};

// Helper to get tokens for a user (for middleware or other API calls)
exports.getTokensForUser = (userId) => {
  return tokensStore[userId];
};

// Helper to set credentials for a specific API call
exports.setCredentialsForClient = (userId) => {
  const tokens = tokensStore[userId];
  if (tokens) {
    oauth2Client.setCredentials(tokens);
    return true;
  }
  return false;
};

exports.checkAuthStatus = (req, res) => {
  // If this endpoint is reached, it means the authenticate middleware passed.
  // So, the user is authenticated.
  res.status(200).send({ authenticated: true });
};
