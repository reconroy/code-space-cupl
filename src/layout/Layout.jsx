import React from 'react';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-10">
        <Navbar />
      </header>
      
      <main className="flex-grow relative">
        <div className="absolute inset-0">
          <CodeEditor />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
