import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useTypingEffect from './../animations/useTypingEffect';
import useThemeStore from '.././store/useThemeStore';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const phrases = [
    "Welcome to CodeSpace!",
    "An AI code editor",
    "Share code safely",
    "Collaborate in real-time"
  ];

  // Adjust these values to fine-tune the animation
  const typingSpeed = 50; // Faster typing (lower number = faster)
  const deletingSpeed = 50; // Faster deleting (lower number = faster)
  const pauseDuration = 3000; // Longer pause (higher number = longer pause)

  const animatedText = useTypingEffect(phrases, typingSpeed, deletingSpeed, pauseDuration);

  const createNewCodespace = async () => {
    const newSlug = Math.random().toString(36).substr(2, 9);
    try {
      await axios.post('/api/codespace', { slug: newSlug });
      navigate(`/${newSlug}`);
    } catch (error) {
      console.error('Failed to create new codespace:', error);
    }
  };

  return (
    <div className="home-page flex-grow flex items-center justify-center p-4">
      <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl">
        <h1 className={`animated-heading ${isDarkMode ? 'text-white' : 'text-gray-800'} text-2xl sm:text-3xl md:text-4xl lg:text-5xl whitespace-nowrap overflow-hidden`}>
          {animatedText}
        </h1>
        <p className={`mt-4 mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm sm:text-base`}>
          Create a new codespace or use a slug in the URL to edit an existing one.
        </p>
        <button 
          onClick={createNewCodespace}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
        >
          Create New Codespace
        </button>
      </div>
    </div>
  );
};

export default HomePage;