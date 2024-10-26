import React, { useState, useRef, useEffect } from 'react';
import Monaco from '@monaco-editor/react';
import useThemeStore from '../store/useThemeStore';

const DiffChecker = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ theme: isDarkMode ? 'vs-dark' : 'light' });
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ theme: isDarkMode ? 'vs-dark' : 'light' });
    }
  }, [isDarkMode]);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex-grow flex">
        <div className="w-1/2 p-2">
          <h2 className="text-xl font-bold mb-2">Original Code</h2>
          <Monaco
            height="90vh"
            language="javascript"
            theme={isDarkMode ? 'vs-dark' : 'light'}
            value={originalCode}
            onChange={(value) => setOriginalCode(value)}
            onMount={handleEditorDidMount}
            options={{
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
        </div>
        <div className="w-1/2 p-2">
          <h2 className="text-xl font-bold mb-2">Modified Code</h2>
          <Monaco
            height="90vh"
            language="javascript"
            theme={isDarkMode ? 'vs-dark' : 'light'}
            value={modifiedCode}
            onChange={(value) => setModifiedCode(value)}
            onMount={handleEditorDidMount}
            options={{
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
        </div>
      </div>
    </div>
  );
};

export default DiffChecker;
