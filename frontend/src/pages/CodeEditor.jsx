import React, { useEffect, useRef, useState } from 'react';
import Monaco from '@monaco-editor/react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import useThemeStore from '../store/useThemeStore';
import useFontSizeStore from '../store/useFontSizeStore';

// Import languages for highlight.js detection
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import csharp from 'highlight.js/lib/languages/csharp';
import typescript from 'highlight.js/lib/languages/typescript';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala'; 
  
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';

// Register languages with highlight.js
const languages = { javascript, python, css, java, cpp, xml, json, markdown, csharp, typescript, ruby, go, rust, swift, kotlin, scala, php, sql };
Object.entries(languages).forEach(([name, lang]) => hljs.registerLanguage(name, lang));

const CodeEditor = ({ code, setCode, language, setLanguage, socket, slug }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const editorRef = useRef(null);
  const { fontSize, setFontSize } = useFontSizeStore();
  const [showSlider, setShowSlider] = useState(false);
  const [decorations, setDecorations] = useState([]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ 
        theme: isDarkMode ? 'vs-dark' : 'light',
        fontSize: fontSize
      });
    }
  }, [isDarkMode, fontSize]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleEditorDidMount = (editor, monaco) => {
    // console.log("Editor mounted");
    editorRef.current = editor;
    editor.updateOptions({ 
      theme: isDarkMode ? 'vs-dark' : 'light',
      fontSize: fontSize
    });

    // Add selection change listener
    editor.onDidChangeCursorSelection((e) => {
      if (socket) {
        const selection = editor.getSelection();
        if (selection.isEmpty()) {
          // If selection is empty (deselected), send a clear event
          socket.emit('clearSelection', { slug });
        } else {
          socket.emit('selectionChange', { slug, selection });
        }
      }
    });

    // Add content change listener
    editor.onDidChangeModelContent((e) => {
      // Clear remote selection when content changes (e.g., paste operation)
      clearRemoteSelection();
    });

    // Enable Emmet and auto-completion
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      allowNonTsExtensions: true
    });

    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare var console: {
        log(message?: any, ...optionalParams: any[]): void;
      };
    `, 'ts:filename/console.d.ts');
  };

  const clearRemoteSelection = () => {
    if (editorRef.current) {
      const clearedDecorations = editorRef.current.deltaDecorations(decorations, []);
      setDecorations(clearedDecorations);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('selectionUpdate', ({ selection }) => {
        if (editorRef.current) {
          // Clear previous decorations
          clearRemoteSelection();
          // Create a new decoration for the received selection
          const newDecorations = editorRef.current.deltaDecorations([], [
            {
              range: selection,
              options: {
                className: 'remote-selection',
                hoverMessage: { value: 'Remote selection' }
              }
            }
          ]);
          setDecorations(newDecorations);
        }
      });

      socket.on('clearSelection', () => {
        clearRemoteSelection();
      });
    }

    return () => {
      if (socket) {
        socket.off('selectionUpdate');
        socket.off('clearSelection');
      }
    };
  }, [socket]);

  const toggleFontSizeSlider = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className="relative h-full w-full">
      <Monaco
        height="100%"
        width="100%"
        language={language}
        theme={isDarkMode ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: fontSize,
          padding: { top: 20, bottom: 20 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          minimap: { enabled: false },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          autoClosingBrackets: 'always',
          autoIndent: 'full',
          formatOnType: true,
          formatOnPaste: true
        }}
      />
      {showSlider && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-32"
          />
        </div>
      )}
      <button
        onClick={toggleFontSizeSlider}
        className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded"
      >
        {showSlider ? 'Hide' : 'Show'} Font Size Slider
      </button>
    </div>
  );
};

export default CodeEditor;