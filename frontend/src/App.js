// src/App.js
import React, { useState, useEffect } from 'react';
import axios from './api/axiosInstance';
import Header from './components/Header';
import JokeList from './components/JokeList';
import JokeForm from './components/JokeForm';

function App() {
  const [jokes, setJokes] = useState([]);

  // Fetch jokes from the API
  const fetchJokes = async () => {
    try {
      const response = await axios.get('/jokes');
      const jokesData = response.data;

      // Shuffle the jokes array
      for (let i = jokesData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jokesData[i], jokesData[j]] = [jokesData[j], jokesData[i]];
      }

      setJokes(jokesData);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert('You are making requests too quickly. Please try again later.');
      } else {
        console.error('Error fetching jokes:', error);
        alert('An error occurred while fetching jokes.');
      }
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  // Handle voting (upvote or downvote)
  const handleVote = async (id, action) => {
    try {
      await axios.post(`/jokes/${id}/vote`, { action });
      setJokes((prevJokes) =>
        prevJokes.map((joke) =>
          joke.id === id
            ? { ...joke, votes: joke.votes + (action === 'upvote' ? 1 : -1) }
            : joke
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert('You are making requests too quickly. Please try again later.');
      } else {
        console.error('Error voting:', error);
        alert('An error occurred while voting.');
      }
    }
  };

  // Handle submitting a new joke
  const handleSubmitJoke = async (content) => {
    try {
      const response = await axios.post('/jokes', { content });
      const newJoke = response.data;
      setJokes((prevJokes) => [newJoke, ...prevJokes]);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert('You are making requests too quickly. Please try again later.');
      } else {
        console.error('Error submitting joke:', error);
        alert('An error occurred while submitting your joke.');
      }
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
