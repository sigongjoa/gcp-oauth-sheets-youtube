require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const whitelist = ['http://localhost:5173', 'http://localhost:5714'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.send('GCP Integration Backend is running!');
});

const authRoutes = require('./src/api/auth/auth.routes');
app.use('/auth', authRoutes);

// TODO: Add authentication routes
const driveRoutes = require('./src/api/drive/drive.routes');
app.use('/api/drive', driveRoutes);

const sheetsRoutes = require('./src/api/sheets/sheets.routes');
app.use('/api/sheets', sheetsRoutes);

const docsRoutes = require('./src/api/docs/docs.routes');
app.use('/api/docs', docsRoutes);

const youtubeRoutes = require('./src/api/youtube/youtube.routes');
app.use('/api/youtube', youtubeRoutes);

// TODO: Add API routes for YouTube

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
