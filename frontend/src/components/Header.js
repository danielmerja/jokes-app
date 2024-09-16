// src/components/Header.js
import React from 'react';

function Header({ totalJokes }) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Name */}
        <h1 className="text-2xl font-bold">World's Best Joke</h1>
        
        {/* Total Jokes */}
        <div className="flex items-center">
          <span className="text-sm mr-2">Total Jokes:</span>
          <span className="font-semibold">{totalJokes}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
