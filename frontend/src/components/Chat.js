import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input }]);
      setInput('');
    }
  };

  return (
    // Updated container with responsive width and no shrinking
    <div className="w-full md:w-80 flex-shrink-0 bg-white border-l border-gray-300 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Global Chat</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="text-gray-800">{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-300">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Chat;