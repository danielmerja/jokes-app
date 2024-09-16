// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import JokeList from './components/JokeList';
import JokeForm from './components/JokeForm';

function App() {
  const [jokes, setJokes] = useState([]);

  // Fetch jokes from the API
  const fetchJokes = async () => {
    try {
      const response = await axios.get('/api/jokes');
      const jokesData = response.data;

      // Shuffle the jokes array
      for (let i = jokesData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jokesData[i], jokesData[j]] = [jokesData[j], jokesData[i]];
      }

      setJokes(jokesData);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  // Handle voting (upvote or downvote)
  const handleVote = async (id, action) => {
    try {
      await axios.post(`/api/jokes/${id}/vote`, { action });
      setJokes((prevJokes) =>
        prevJokes.map((joke) =>
          joke.id === id
            ? { ...joke, votes: joke.votes + (action === 'upvote' ? 1 : -1) }
            : joke
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Handle submitting a new joke
  const handleSubmitJoke = async (content) => {
    try {
      const response = await axios.post('/api/jokes', { content });
      const newJoke = response.data;
      setJokes((prevJokes) => [newJoke, ...prevJokes]);
    } catch (error) {
      console.error('Error submitting joke:', error);
    }
  };

  return (
    <div className="App flex flex-col min-h-screen">
      {/* Header Component */}
      <Header totalJokes={jokes.length} />

      {/* JokeList component fills the available space */}
      <div className="flex-grow">
        <JokeList jokes={jokes} handleVote={handleVote} />
      </div>

      {/* JokeForm component at the bottom */}
      <div className="p-4">
        <JokeForm handleSubmitJoke={handleSubmitJoke} />
      </div>
    </div>
  );
}

export default App;
