import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useThemeStore from '../store/useThemeStore';
import HomePage from '../pages/HomePage';
import CodespacePage from '../pages/Codespace';

const Layout = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="z-10">
        <Navbar />
      </header>

      <main className="flex-grow flex relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:slug" element={<CodespacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;