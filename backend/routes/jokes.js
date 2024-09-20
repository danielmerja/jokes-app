// routes/jokes.js
const express = require('express');
const router = express.Router();
const Joke = require('../models/Joke');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiter to all jokes routes
router.use(rateLimiter);

// GET /api/jokes
router.get('/', async (req, res) => {
  try {
    const jokes = await Joke.findAll({ order: [['votes', 'DESC']] });
    res.json(jokes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/jokes
router.post('/', async (req, res) => {
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
router.post('/:id/vote', async (req, res) => {
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

module.exports = router;
