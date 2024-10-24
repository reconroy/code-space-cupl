import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const AIChatbot = ({ isDarkMode, code }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Here you would typically make an API call to your AI service
    // For now, we'll just simulate a response
    setTimeout(() => {
      const aiMessage = { text: "I'm sorry, I'm just a placeholder AI. I can't actually help with your code yet!", sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <>
      <button
        className={`fixed bottom-4 right-4 p-3 rounded-full ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaRobot size={24} />
      </button>
      {isOpen && (
        <div className={`fixed bottom-20 right-4 w-80 h-96 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-lg flex flex-col`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>
          <div className="flex-grow overflow-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="Ask about your code..."
            />
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;