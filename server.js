const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,  // This is the MySQL port
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

app.use(express.json());

// API routes
app.get('/api/codespace/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM codespaces WHERE slug = ?', [slug]);
      if (rows.length > 0) {
        res.json({ message: 'Existing codespace', data: rows[0] });
      } else {
        const [result] = await pool.query('INSERT INTO codespaces (slug, content) VALUES (?, ?)', [slug, '']);
        res.json({ message: 'New codespace created', data: { id: result.insertId, slug, content: '' } });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  });

app.put('/api/codespace/:slug', async (req, res) => {
  const { slug } = req.params;
  const { content } = req.body;
  try {
    await pool.query('UPDATE codespaces SET content = ? WHERE slug = ?', [content, slug]);
    res.json({ message: 'Codespace updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});