import React, { useEffect, useRef , useState } from 'react';
import Monaco from '@monaco-editor/react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import useThemeStore from '../store/useThemeStore';
import useFontSizeStore from '../store/useFontSizeStore';
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

const CodeEditor = ({ code, setCode, setLanguage }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const editorRef = useRef(null);
  const { fontSize, showFontSizeSlider } = useFontSizeStore();
  // Function to detect the language using highlight.js
  const detectLanguage = (code) => {
    const result = hljs.highlightAuto(code);
    return result.language || 'plaintext';
  };

  // Update the language whenever the code changes
  useEffect(() => {
    const detectedLang = detectLanguage(code);
    setLanguage(detectedLang);
  }, [code, setLanguage]);

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
    editorRef.current = editor;
    editor.updateOptions({ 
      theme: isDarkMode ? 'vs-dark' : 'light',
      fontSize: fontSize // Set initial font size
    });

    // Enable Emmet for HTML, CSS, and JavaScript
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: 'div',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<div>\n\t$0\n</div>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Insert a div element'
            }
          ]
        };
      }
    });

    // Enable auto-completion and suggestions
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

  const toggleFontSizeSlider = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className="relative h-full w-full">
      <Monaco
        height="100%"
        width="100%"
        language={detectLanguage(code)}
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
    </div>
  );
};

export default CodeEditor;