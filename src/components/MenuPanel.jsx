import React from 'react';
import { FaDownload } from 'react-icons/fa';
import useThemeStore from '../store/useThemeStore';

const languageExtensions = {
  javascript: 'js',
  python: 'py',
  css: 'css',
  java: 'java',
  cpp: 'cpp',
  xml: 'html',
  json: 'json',
  markdown: 'md',
  c: 'c',
  csharp: 'cs',
  html: 'html', // Added html
  plaintext: 'txt', // Default to txt for unknown languages
};

const MenuPanel = ({ code, language }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handleDownload = () => {
    const fileExtension = languageExtensions[language] || 'txt';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `code-space-${timestamp}.${fileExtension}`;

    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-1/10 p-4 shadow-lg 
      ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <button 
        onClick={handleDownload} 
        className={`p-2 mt-4 rounded hover:bg-opacity-75 transition-transform transform hover:scale-105 
          ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        aria-label="Download Code"
      >
        <FaDownload className="text-2xl" />
      </button>
    </div>
  );
};

export default MenuPanel;