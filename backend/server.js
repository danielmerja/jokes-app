// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Joke = require('./models/Joke');
const jokesRoutes = require('./routes/jokes');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN, // e.g., http://localhost:3000
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api/jokes', jokesRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to World’s Best Joke API');
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
