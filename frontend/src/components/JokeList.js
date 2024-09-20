// src/components/JokeList.js
import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import axios from '../api/axiosInstance';
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

function JokeList({ jokes, handleVote }) {
  const [windowWidth, windowHeight] = useWindowSize();
  const [activeJokeId, setActiveJokeId] = useState(null); // State for active hover card

  // Adjust these values to change tile size and spacing
  const tileSize = 10; // Size of the tile in pixels
  const tileSpacing = 3; // Space between tiles in pixels

  const columnWidth = tileSize + tileSpacing;
  const rowHeight = tileSize + tileSpacing;

  const columnCount = Math.floor(windowWidth / columnWidth) || 1; // Prevent division by zero
  const rowCount = Math.ceil(jokes.length / columnCount);

  // Calculate the maximum absolute vote count for dynamic scaling
  const maxVotes = jokes.length
    ? Math.max(...jokes.map((joke) => Math.abs(joke.votes)))
    : 0;

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
          <Tile
            joke={joke}
            handleVote={handleVote}
            tileSize={tileSize}
            maxVotes={maxVotes}
            isActive={activeJokeId === joke.id} // Determine if this tile's hover card is active
            setActiveJokeId={setActiveJokeId} // Pass setter to control active hover card
          />
        </div>
      );
    },
    [jokes, handleVote, columnCount, tileSize, tileSpacing, maxVotes, activeJokeId]
  );

  return (
    <div className="flex-grow overflow-hidden">
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={windowHeight - 300} // Adjust based on your layout
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
