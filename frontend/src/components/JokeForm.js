// src/components/JokeForm.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';

function JokeForm({ handleSubmitJoke }) {
  const [content, setContent] = useState('');

  const submitJoke = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await handleSubmitJoke(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting joke:', error);
      alert('An error occurred while submitting your joke.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Submit a Joke</h2>
      <form onSubmit={submitJoke}>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your joke here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={280} // Added character limit
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Submit Joke
        </button>
      </form>
    </div>
  );
}

export default JokeForm;
