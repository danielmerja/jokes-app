// src/components/Tile.js
import React, { useState, useRef, useEffect } from 'react';

function Tile({ joke, handleVote, tileSize, maxVotes, isActive, setActiveJokeId }) {
  // Reference to the tile DOM element for position calculations
  const tileRef = useRef(null);

  // State to manage the position of the hover tooltip
  const [hoverPosition, setHoverPosition] = useState({
    left: '50%',
    transform: 'translateX(-50%)',
  });

  // Define minimum and maximum intensity for color scaling
  const MIN_INTENSITY = 100; // Ensures noticeable color even for low votes
  const MAX_INTENSITY = 255; // Maximum color intensity

  // Avoid division by zero
  const effectiveMaxVotes = maxVotes > 0 ? maxVotes : 1;

  // Calculate color intensity based on votes
  const calculateIntensity = (votes) => {
    if (votes > 0) {
      // Positive votes: Green
      const intensity = Math.min(
        Math.max((votes / effectiveMaxVotes) * (MAX_INTENSITY - MIN_INTENSITY) + MIN_INTENSITY, MIN_INTENSITY),
        MAX_INTENSITY
      );
      return `rgb(0, ${Math.round(intensity)}, 0)`;
    } else if (votes < 0) {
      // Negative votes: Red
      const intensity = Math.min(
        Math.max((-votes / effectiveMaxVotes) * (MAX_INTENSITY - MIN_INTENSITY) + MIN_INTENSITY, MIN_INTENSITY),
        MAX_INTENSITY
      );
      return `rgb(${Math.round(intensity)}, 0, 0)`;
    } else {
      // Zero votes: Grey
      return 'rgb(200, 200, 200)';
    }
  };

  // Determine background color based on the number of votes
  const backgroundColor = calculateIntensity(joke.votes);

  // Handle click event to toggle hover card
  const handleClick = () => {
    if (isActive) {
      setActiveJokeId(null); // Close if already active
    } else {
      setActiveJokeId(joke.id); // Open this hover card
    }
  };

  // Close the hover card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tileRef.current &&
        !tileRef.current.contains(event.target)
      ) {
        setActiveJokeId(null);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, setActiveJokeId]);

  // Calculate hover card position on mount and when active
  useEffect(() => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      // Default tooltip position
      let left = '50%';
      let transform = 'translateX(-50%)';

      if (rect.left < 160) {
        // If the tile is near the left edge, align tooltip to the left
        left = '0';
        transform = 'translateX(0)';
      } else if (rect.right > viewportWidth - 160) {
        // If the tile is near the right edge, align tooltip to the right
        left = '100%';
        transform = 'translateX(-100%)';
      }

      // Update the hover position state with new values
      setHoverPosition({ left, transform });
    }
  }, [isActive]);

  return (
    <div
      ref={tileRef} // Attach the ref to the tile div
      onClick={handleClick} // Attach click handler
      style={{
        width: `${tileSize}px`, // Set tile width based on prop
        height: `${tileSize}px`, // Set tile height based on prop
        backgroundColor: backgroundColor, // Apply dynamic background color
        position: 'relative', // Relative positioning for absolute children
        cursor: 'pointer', // Change cursor to pointer
        transition: 'background-color 0.3s ease', // Smooth color transition
      }}
      className="group transition-colors" // Tailwind CSS classes for styling
      role="button" // Accessibility role
      aria-haspopup="true" // Indicates that the tile has a popup
      aria-expanded={isActive} // Indicates whether the popup is open
      tabIndex={0} // Make the tile focusable
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Hover content container */}
      {isActive && (
        <div
          className="absolute z-10 transition-opacity duration-200"
          style={{
            top: '100%', // Position below the tile
            left: hoverPosition.left, // Dynamic left position
            transform: hoverPosition.transform, // Dynamic transform
            width: '300px', // Fixed width for tooltip
            marginTop: '8px', // Spacing above tooltip
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
          }}
        >
          <div className="bg-white p-4 rounded shadow-lg">
            {/* Display the joke content */}
            <p className="text-sm text-gray-800 mb-4">{joke.content}</p>
            <div className="flex justify-between items-center">
              {/* Upvote button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  handleVote(joke.id, 'upvote'); // Call upvote handler
                }}
                className="text-green-600 hover:text-green-800 focus:outline-none"
                aria-label="Upvote joke" // Accessibility label
              >
                👍 Upvote
              </button>
              
              {/* Display the number of votes */}
              <span className="text-xs text-gray-600">{joke.votes} votes</span>
              
              {/* Downvote button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  handleVote(joke.id, 'downvote'); // Call downvote handler
                }}
                className="text-red-600 hover:text-red-800 focus:outline-none"
                aria-label="Downvote joke" // Accessibility label
              >
                👎 Downvote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tile;
