// models/Joke.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Joke;
