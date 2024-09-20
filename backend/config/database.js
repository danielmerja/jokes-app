// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../jokes.db'), // Database file path
  logging: false, // Disable logging; enable for debugging
});

module.exports = sequelize;
