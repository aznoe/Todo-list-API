require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const pool = require('./db');
const db = require("./db.js");
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // npm install jsonwebtoken

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our API!', status: 'success' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      username,
      message: 'User created successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add this to your existing routes
app.get('/api/users', async (req, res) => {
  try {
    // Query to select all users (without passwords for security)
    const [users] = await pool.query(
      'SELECT id, username, created_at FROM Users'
    );
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Verify user credentials
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 2. Generate NEW JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    
    // 3. Return token to client
    res.json({ token });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Connect to DB and start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
