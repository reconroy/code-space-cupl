const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
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

app.get('/api/codespace/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM codespaces WHERE slug = ?', [slug]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Codespace not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/codespace', async (req, res) => {
  const { slug, content, language } = req.body;
  try {
    await pool.query('INSERT INTO codespaces (slug, content, language) VALUES (?, ?, ?)', [slug, content || '', language || 'javascript']);
    res.json({ message: 'Codespace created', slug });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/codespace/:slug', async (req, res) => {
  const { slug } = req.params;
  const { content, language } = req.body;
  try {
    await pool.query('UPDATE codespaces SET content = ?, language = ? WHERE slug = ?', [content, language, slug]);
    res.json({ message: 'Codespace updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});