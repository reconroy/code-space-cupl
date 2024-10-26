import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const newSocket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket'],
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinRoom', slug);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to the server. Please try again.');
      setIsLoading(false);
    });

    newSocket.on('roomJoined', ({ slug, message }) => {
      console.log(message);
      fetchCodespace();
    });

    newSocket.on('roomError', ({ slug, message }) => {
      console.error(message);
      setError('Failed to join the room. Please try again.');
      setIsLoading(false);
    });

    newSocket.on('codeUpdate', (updatedCode) => {
      setCode(updatedCode);
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('roomJoined');
      newSocket.off('roomError');
      newSocket.off('codeUpdate');
      newSocket.close();
    };
  }, [slug]);

  const fetchCodespace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/codespace/${slug}`);
      setCode(response.data.content || '');
      setLanguage(response.data.language || 'javascript');
    } catch (error) {
      console.error('Error fetching codespace:', error);
      setError('Failed to fetch codespace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const saveCode = useCallback(async (codeToSave, langToSave) => {
    try {
      console.log('Saving code:', { slug, content: codeToSave, language: langToSave });
      await axios.put(`/api/codespace/${slug}`, { content: codeToSave, language: langToSave });
      console.log('Code saved successfully');
      if (socket && socket.connected) {
        socket.emit('codeChange', { slug, content: codeToSave });
      } else {
        console.error('Socket is not connected. Unable to emit codeChange event.');
      }
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
          socket={socket}
          slug={slug}
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