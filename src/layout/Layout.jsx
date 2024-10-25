import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CodeEditor from '../pages/CodeEditor';
import Footer from '../components/Footer';
import MenuPanel from '../components/MenuPanel';
import useThemeStore from '../store/useThemeStore';

const Layout = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext');

  const toggleFontSizeSlider = () => {
    console.log('Toggling font size slider'); // Add this line
    setShowFontSizeSlider(prevState => {
      console.log('New slider state:', !prevState); // Add this line
      return !prevState;
    });
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <header className="z-10">
        <Navbar />
      </header>
      
      <main className="flex-grow flex relative">
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
          />
        </div>
      </main>
      
      <footer className="z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;