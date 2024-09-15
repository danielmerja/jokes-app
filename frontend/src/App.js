// src/App.js
import React from 'react';
import JokeList from './components/JokeList';
import JokeForm from './components/JokeForm';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      {/* JokeList component fills the available space */}
      <div className="flex-grow">
        <JokeList />
      </div>
      {/* JokeForm component at the bottom */}
      <div className="p-4">
        <JokeForm />
      </div>
    </div>
  );
}

export default App;
