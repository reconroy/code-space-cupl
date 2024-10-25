import React from 'react';
import { FaDownload, FaTextHeight, FaSave } from 'react-icons/fa';
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

const MenuPanel = ({ code, language, onSave }) => {
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

  const handleToggleFontSizeSlider = () => {
    if (typeof toggleFontSizeSlider === 'function') {
      toggleFontSizeSlider();
    } else {
      console.error('toggleFontSizeSlider is not a function');
    }
  };

  const buttonClasses = `
  p-2 mb-4 
  rounded-full md:rounded 
  hover:bg-opacity-75 transition-transform transform hover:scale-105 
  ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}
`;

return (
  <div className={`w-16 md:w-20 h-full py-2 px-1 md:px-2 shadow-lg flex flex-col items-center justify-start
    ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
    <button 
      onClick={handleDownload} 
      className={buttonClasses}
      aria-label="Download Code"
      title="Download Code"
    >
      <FaDownload className="text-lg md:text-xl" />
    </button>
    <button 
      onClick={onSave} 
      className={buttonClasses}
      aria-label="Save Code"
      title="Save Code"
    >
      <FaSave className="text-lg md:text-xl" />
    </button>
    <div className="relative">
      {showFontSizeSlider && (
        <div className="absolute right-full mr-2 top-0">
          <FontSizeSlider />
        </div>
      )}
      <button 
        onClick={toggleFontSizeSlider} 
        className={buttonClasses}
        aria-label="Toggle Font Size Slider"
        title="Toggle Font Size"
      >
        <FaTextHeight className="text-lg md:text-xl" />
      </button>
    </div>
  </div>
);
};

export default MenuPanel;