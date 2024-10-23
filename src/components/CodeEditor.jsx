import React, { useState, useEffect } from 'react';
import  Monaco  from '@monaco-editor/react';
import hljs from 'highlight.js/lib/core'; // Core highlight.js library
import 'highlight.js/styles/github.css'; // Optional: Style for code highlighting

// Import languages you want highlight.js to detect
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';

// Register the languages with highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext'); // Default language is plaintext

  // Function to detect the language using highlight.js
  const detectLanguage = (code) => {
    const result = hljs.highlightAuto(code);
    return result.language || 'plaintext'; // Default to plaintext if detection fails
  };

  // Update the language whenever the code changes
  useEffect(() => {
    const detectedLang = detectLanguage(code);
    setLanguage(detectedLang);
  }, [code]);

  const handleEditorChange = (value) => {
    setCode(value); // Update code state
  };

  return (
    <div>
      <h2>Monaco Editor with Language Detection</h2>
      <Monaco
        height="500px"
        width="100%"
        language={language} // Dynamically set the language based on detection
        theme="vs-dark"
        value={code} // The code content in the editor
        onChange={handleEditorChange} // Handle code changes
      />
      <p>Detected Language: {language}</p>
    </div>
  );
};

export default CodeEditor;
