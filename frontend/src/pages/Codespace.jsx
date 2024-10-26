import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from './CodeEditor';
import MenuPanel from './../components/MenuPanel';
import { io } from 'socket.io-client';

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
  const [socket, setSocket] = useState(null);

  const fetchOrCreateCodespace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${slug}`);
      console.log('Fetched existing codespace:', response.data);
      setCode(response.data.content || '');
      setLanguage(response.data.language || 'javascript');
    } catch (fetchError) {
      console.log('Fetch error:', fetchError.response?.status);
      if (fetchError.response && fetchError.response.status === 404) {
        try {
          console.log('Creating new codespace');
          const createResponse = await axios.post('/api/codespace', { slug, content: '', language: 'javascript' });
          console.log('Created new codespace:', createResponse.data);
          setCode(createResponse.data.content || '');
          setLanguage(createResponse.data.language || 'javascript');
        } catch (createError) {
          console.error('Error creating new codespace:', createError);
          setError('Failed to create new codespace');
        }
      } else {
        console.error('Error fetching codespace:', fetchError);
        setError('Failed to fetch codespace');
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchOrCreateCodespace();
  }, [fetchOrCreateCodespace]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinRoom', slug);
    });

    newSocket.on('codeUpdate', (updatedCode) => {
      setCode(updatedCode);
    });

    return () => newSocket.close();
  }, [slug]);

  const saveCode = useCallback(async (codeToSave, langToSave) => {
    try {
      console.log('Saving code:', { slug, content: codeToSave, language: langToSave });
      await axios.put(`/api/codespace/${slug}`, { content: codeToSave, language: langToSave });
      console.log('Code saved successfully');
      socket.emit('codeChange', { slug, content: codeToSave });
    } catch (error) {
      console.error('Error saving code:', error);
    }
  }, [slug, socket]);

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