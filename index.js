require("dotenv").config();
const express = require("express");
const pool = require('./db.js'); // Only need this one
const app = express();

const { body } = require('express-validator');
const { login } = require('./authController');
const { createUser } = require('./userController');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Add this to parse JSON bodies

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our API!', status: 'success' });
});

app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, username FROM users');
    
    res.json({
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({
      success: false,
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
//Login
app.post('/api/login', 
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login

);






//Create user
app.post('/api/createuser',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  createUser
);


//DOCUMENTATION 
// app.get('/api-docs', (req, res) => {
//   res.json({
//     endpoints: {
//       users: {
//         getAll: 'GET /api/users',
//         getOne: 'GET /api/users/:id',
//         withTodos: 'GET /api/users/:id?include=todos'
//       },
//       todos: {
//         byUser: 'GET /api/todos/user/:userId',
//         single: 'GET /api/todos/:id'
//       }
//     },
//     status: 'operational',
//     dbConnection: 'active',
//     lastChecked: new Date().toISOString()
//   });
// });

app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});