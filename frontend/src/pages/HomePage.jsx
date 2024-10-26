import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();

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
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Welcome to Codespace</h1>
        <p className="mb-4">Create a new codespace or enter a slug in the URL to edit an existing one.</p>
        <button 
          onClick={createNewCodespace}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Codespace
        </button>
      </div>
    </div>
  );
};

export default HomePage;