import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from './CodeEditor';
import MenuPanel from './../components/MenuPanel';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const CodespacePage = () => {
  const { slug } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCodespace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${slug}`);
      console.log('Fetched data:', response.data);
      setCode(response.data.content || '');
      setLanguage(response.data.language || 'javascript');
    } catch (error) {
      console.error('Error fetching codespace:', error);
      if (error.response && error.response.status === 404) {
        console.log('Codespace not found, creating new one');
        try {
          await axios.post('/api/codespace', { slug, content: '', language: 'javascript' });
          setCode('');
          setLanguage('javascript');
        } catch (createError) {
          console.error('Error creating new codespace:', createError);
          setError('Failed to create new codespace');
        }
      } else {
        setError('Failed to fetch codespace');
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCodespace();
  }, [fetchCodespace]);

  const saveCode = useCallback(async (codeToSave, langToSave) => {
    try {
      console.log('Saving code:', { slug, content: codeToSave, language: langToSave });
      await axios.put(`/api/codespace/${slug}`, { content: codeToSave, language: langToSave });
      console.log('Code saved successfully');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  }, [slug]);

  const debouncedSave = useCallback(
    debounce((codeToSave, langToSave) => saveCode(codeToSave, langToSave), 3000),
    [saveCode]
  );

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    debouncedSave(newCode, language);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    debouncedSave(code, newLanguage);
  };

  if (isLoading) {
    return <div className="flex-grow flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex-grow flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex-grow flex relative">
      <div className="flex-grow">
        <CodeEditor 
          code={code} 
          setCode={handleCodeChange}
          language={language}
          setLanguage={handleLanguageChange}
        />
      </div>
      <div className="absolute top-0 right-0 h-full">
        <MenuPanel 
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default CodespacePage;