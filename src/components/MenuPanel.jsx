import React from 'react';
import { FaDownload, FaTextHeight } from 'react-icons/fa';
import useThemeStore from '../store/useThemeStore';
import useFontSizeStore from '../store/useFontSizeStore';
import FontSizeSlider from '../sub_components/FontSizeSlider';

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
  html: 'html',
  plaintext: 'txt',
};

const MenuPanel = ({ code, language, onLanguageChange }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { showFontSizeSlider, toggleFontSizeSlider } = useFontSizeStore();

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
    <div className={`w-16 md:w-20 h-full py-2 px-1 md:px-2 shadow-lg flex flex-col items-center justify-start
      ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
      <button 
        onClick={handleDownload} 
        className={`p-2 mb-4 rounded-full md:rounded hover:bg-opacity-75 transition-transform transform hover:scale-105 
          ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        aria-label="Download Code"
        title="Download Code"
      >
        <FaDownload className="text-lg md:text-xl" />
      </button>
      <div className="relative">
        <button 
          onClick={toggleFontSizeSlider} 
          className={`p-2 rounded-full md:rounded hover:bg-opacity-75 transition-transform transform hover:scale-105 
            ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
          aria-label="Adjust Font Size"
          title="Adjust Font Size"
        >
          <FaTextHeight className="text-lg md:text-xl" />
        </button>
        {showFontSizeSlider && (
          <div className="absolute right-full top-0 mr-2">
            <FontSizeSlider />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPanel;