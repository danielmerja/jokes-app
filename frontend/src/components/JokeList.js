// src/components/JokeList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FixedSizeGrid as Grid } from 'react-window';
import Tile from './Tile';

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

function JokeList() {
  const [jokes, setJokes] = useState([]);
  const [windowWidth, windowHeight] = useWindowSize();

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

  // Adjust these values to change tile size and spacing
  const tileSize = 8; // Size of the tile in pixels
  const tileSpacing = 2; // Space between tiles in pixels

  const columnWidth = tileSize + tileSpacing;
  const rowHeight = tileSize + tileSpacing;

  const columnCount = Math.floor(windowWidth / columnWidth);
  const rowCount = Math.ceil(jokes.length / columnCount);

  // Cell renderer
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * columnCount + columnIndex;
      if (index >= jokes.length) {
        return null;
      }
      const joke = jokes[index];
      return (
        <div
          style={{
            ...style,
            left: style.left + tileSpacing,
            top: style.top + tileSpacing,
            width: tileSize,
            height: tileSize,
          }}
        >
          <Tile joke={joke} handleVote={handleVote} tileSize={tileSize} />
        </div>
      );
    },
    [jokes, handleVote, columnCount, tileSize, tileSpacing]
  );

  return (
    <div className="flex-grow overflow-hidden">
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={windowHeight - 200} // Adjust based on your layout
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={windowWidth}
      >
        {Cell}
      </Grid>
    </div>
  );
}

export default JokeList;
