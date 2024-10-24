import React, { useState, useEffect, useRef } from 'react';
import Monaco from '@monaco-editor/react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import AIChatbot from '../chatbots/AIChatbot';
import useThemeStore from '../store/useThemeStore';
// Import languages you want highlight.js to detect
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import csharp from 'highlight.js/lib/languages/csharp';

// Register the languages with highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('c', cpp); // C language is similar to C++
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('react', javascript); // React is based on JavaScript
hljs.registerLanguage('angular', javascript); // Angular is based on JavaScript
hljs.registerLanguage('nodejs', javascript); // Node.js is based on JavaScript

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const editorRef = useRef(null);

  // Function to detect the language using highlight.js
  const detectLanguage = (code) => {
    const result = hljs.highlightAuto(code);
    return result.language || 'plaintext';
  };

  // Update the language whenever the code changes
  useEffect(() => {
    const detectedLang = detectLanguage(code);
    setLanguage(detectedLang);
  }, [code]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ theme: isDarkMode ? 'vs-dark' : 'light' });
    }
  }, [isDarkMode]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.updateOptions({ theme: isDarkMode ? 'vs-dark' : 'light' });
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <Monaco
        height="100%"
        width="100%"
        language={language}
        theme={isDarkMode ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{ padding: { top: 20, bottom: 20 }, scrollBeyondLastLine: false }}
      />
      {/* <AIChatbot isDarkMode={isDarkMode} code={code} /> */}
      
    </div>
  );
};

export default CodeEditor;