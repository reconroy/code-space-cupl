const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json());

io.on('connection', (socket) => {
  socket.on('joinRoom', (slug) => {
    socket.join(slug);
  });

  socket.on('codeChange', async ({ slug, content }) => {
    try {
      await pool.query('UPDATE codespaces SET content = ? WHERE slug = ?', [content, slug]);
      socket.to(slug).emit('codeUpdate', content);
    } catch (error) {
      console.error('Error saving code:', error);
    }
  });
});

app.get('/api/codespace/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    console.log('Fetching codespace for slug:', slug);
    const [rows] = await pool.query('SELECT * FROM codespaces WHERE slug = ?', [slug]);
    if (rows.length > 0) {
      console.log('Codespace found:', rows[0]);
      res.json(rows[0]);
    } else {
      console.log('Codespace not found');
      res.status(404).json({ error: 'Codespace not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/api/codespace', async (req, res) => {
  const { slug, content, language } = req.body;
  try {
    // First, check if the codespace already exists
    const [existingCodespace] = await pool.query('SELECT * FROM codespaces WHERE slug = ?', [slug]);
    
    if (existingCodespace.length > 0) {
      // If it exists, return the existing codespace
      console.log('Codespace already exists:', existingCodespace[0]);
      res.json(existingCodespace[0]);
    } else {
      // If it doesn't exist, create a new one
      await pool.query('INSERT INTO codespaces (slug, content, language) VALUES (?, ?, ?)', [slug, content || '', language || 'javascript']);
      console.log('New codespace created:', { slug, content, language });
      res.json({ message: 'Codespace created', slug });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
app.put('/api/codespace/:slug', async (req, res) => {
  const { slug } = req.params;
  const { content, language } = req.body;
  try {
    console.log('Updating codespace:', { slug, content, language });
    await pool.query('UPDATE codespaces SET content = ?, language = ? WHERE slug = ?', [content, language, slug]);
    res.json({ message: 'Codespace updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});