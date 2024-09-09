const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());

// Load environment variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.AZURE_SQL_CONNECTION_STRING,
});

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Display welcome message
app.get('/', (req, res) => {
  res.send('<html><body><h1>Welcome to TechnoBuilt</h1></body></html>');
});

// GET route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM Users');
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST route to insert a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO Users (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET route to fetch a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'User not found' });
  }
});

// PUT route to update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(
      'UPDATE Users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid update operation' });
  }
});

// DELETE route to delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Users WHERE id = $1', [id]);
    res.status(204).send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

