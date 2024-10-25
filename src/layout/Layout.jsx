import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CodeEditor from '../pages/CodeEditor';
import Footer from '../components/Footer';
import MenuPanel from '../components/MenuPanel';
import useThemeStore from '../store/useThemeStore';

const Layout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCodespace();
    }
  }, [slug]);

  const fetchCodespace = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${slug}`);
      setCode(response.data.data.content);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching codespace:', error);
      setError('Failed to fetch codespace');
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`/api/codespace/${slug}`, { content: code });
      setIsLoading(false);
      alert('Codespace saved successfully!');
    } catch (error) {
      console.error('Error saving codespace:', error);
      setError('Failed to save codespace');
      setIsLoading(false);
    }
  };

  const createNewCodespace = async () => {
    const newSlug = Math.random().toString(36).substr(2, 9);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${newSlug}`);
      console.log('Server response:', response.data);  // Add this line
      navigate(`/${newSlug}`);
    } catch (error) {
      console.error('Error creating new codespace:', error.response ? error.response.data : error.message);
      setError('Failed to create new codespace: ' + (error.response ? error.response.data.error : error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} layout`}>
      <header className="z-10">
        <Navbar />
      </header>
      
      <main className="flex-grow flex relative">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : slug ? (
          <>
            <div className="flex-grow">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                setLanguage={setLanguage} 
              />
            </div>
            <div className="absolute top-0 right-0 h-full">
              <MenuPanel 
                code={code} 
                language={language} 
                onSave={handleSave}
              />
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl mb-4">Welcome to Codespace</h1>
              <p className="mb-4">Create a new codespace or enter a slug in the URL to edit an existing one.</p>
              <button 
                onClick={createNewCodespace}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                Create New Codespace
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;