import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewCodespace, setIsNewCodespace] = useState(false);

  const fetchCodespace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${slug}`);
      console.log('Fetched data:', response.data);
      setCode(response.data.content || '');
      setLanguage(response.data.language || 'javascript');
      setIsNewCodespace(false);
    } catch (error) {
      console.error('Error fetching codespace:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      if (error.response && error.response.status === 404) {
        console.log('Codespace not found, creating new one');
        try {
          const createResponse = await axios.post('/api/codespace', { slug, content: '', language: 'javascript' });
          console.log('Create response:', createResponse.data);
          setCode('');
          setLanguage('javascript');
          setIsNewCodespace(true);
        } catch (createError) {
          console.error('Error creating new codespace:', createError);
          if (createError.response) {
            console.error('Create error response:', createError.response.data);
            console.error('Create error status:', createError.response.status);
          }
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

  useEffect(() => {
    if (isNewCodespace) {
      navigate(`/${slug}`, { replace: true });
      setIsNewCodespace(false);
    }
  }, [isNewCodespace, navigate, slug]);

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
    debounce((codeToSave, langToSave) => saveCode(codeToSave, langToSave), 1000),
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
          code={code}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default CodespacePage;