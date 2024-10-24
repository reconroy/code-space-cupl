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

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <header className="z-10">
        <Navbar />
      </header>
      
      <main className="flex-grow relative flex">
        <div className="flex-grow">
          <CodeEditor code={code} setCode={setCode} setLanguage={setLanguage} />
        </div>
        <MenuPanel code={code} language={language} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;