// api/jokes.js
const { Sequelize, DataTypes } = require('sequelize');
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Initialize Sequelize with SQLite (Note: Serverless functions are stateless)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/tmp/jokes.db', // Temporary storage
  logging: false,
});

// Define the Joke model
const Joke = sequelize.define('Joke', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN, // Set this in Vercel environment variables
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// GET /api/jokes
app.get('/', async (req, res) => {
  try {
    const jokes = await Joke.findAll({ order: [['votes', 'DESC']] });
    res.json(jokes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/jokes
app.post('/', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Joke content is required' });
    }

    const newJoke = await Joke.create({ content, votes: 0 });
    res.status(201).json(newJoke);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/jokes/:id/vote
app.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const joke = await Joke.findByPk(id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }

    if (action === 'upvote') {
      joke.votes += 1;
    } else if (action === 'downvote') {
      joke.votes -= 1;
    } else {
      return res.status(400).json({ message: 'Invalid vote action' });
    }

    await joke.save();
    res.json(joke);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Export the Express app as a Serverless Function
module.exports = app;
