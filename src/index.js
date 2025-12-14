require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const runRoutes = require('./routes/run');
const sportsRoutes = require('./routes/sports');
const aiRoutes = require('./routes/ai');
const gymRoutes = require('./routes/gym');
const youtubeRoutes = require('./routes/youtube');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/run', runRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gym', gymRoutes);
app.use('/api/youtube', youtubeRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('FitMate Backend is running');
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
