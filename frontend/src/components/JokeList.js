// src/components/JokeList.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Tile({ joke, handleVote }) {
  const tileRef = useRef(null);
  const [hoverPosition, setHoverPosition] = useState({
    left: '50%',
    transform: 'translateX(-50%)',
  });

  // Calculate background color based on votes
  const maxVotes = 50; // Adjust based on expected maximum votes
  const greenIntensity =
    joke.votes > 0 ? Math.min((joke.votes / maxVotes) * 255, 255) : 0;
  const backgroundColor =
    joke.votes === 0
      ? 'rgb(200, 200, 200)' // Grey color for zero votes
      : `rgb(0, ${greenIntensity}, 0)`; // Increasing green intensity

  const handleMouseEnter = () => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;

      let left = '50%';
      let transform = 'translateX(-50%)';

      if (rect.left < 160) {
        // Near the left edge
        left = '0';
        transform = 'translateX(0)';
      } else if (rect.right > viewportWidth - 160) {
        // Near the right edge
        left = '100%';
        transform = 'translateX(-100%)';
      }

      setHoverPosition({ left, transform });
    }
  };

  return (
    <div
      ref={tileRef}
      onMouseEnter={handleMouseEnter}
      className="group relative w-4 h-4 cursor-pointer transition-colors"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {/* Hover content */}
      <div
        className="absolute z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
        style={{
          top: '100%',
          left: hoverPosition.left,
          transform: hoverPosition.transform,
          width: '300px',
          marginTop: '8px',
        }}
      >
        <div className="bg-white p-4 rounded shadow-lg">
          <p className="text-sm text-gray-800 mb-4">{joke.content}</p>
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote(joke.id, 'upvote');
              }}
              className="text-green-600 hover:text-green-800 focus:outline-none"
              aria-label="Upvote joke"
            >
              👍 Upvote
            </button>
            <span className="text-xs text-gray-600">{joke.votes} votes</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote(joke.id, 'downvote');
              }}
              className="text-red-600 hover:text-red-800 focus:outline-none"
              aria-label="Downvote joke"
            >
              👎 Downvote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JokeList() {
  const [jokes, setJokes] = useState([]);

  const fetchJokes = async () => {
    try {
      const response = await axios.get('/api/jokes');
      // Shuffle the jokes to ensure random order
      const shuffledJokes = response.data.sort(() => Math.random() - 0.5);
      setJokes(shuffledJokes);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const handleVote = async (id, action) => {
    try {
      await axios.post(`/api/jokes/${id}/vote`, { action });
      // Update the vote count locally without re-fetching to maintain order
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

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="joke-list grid grid-cols-30 gap-1 p-1">
        {jokes.map((joke) => (
          <Tile key={joke.id} joke={joke} handleVote={handleVote} />
        ))}
      </div>
    </div>
  );
}

export default JokeList;
