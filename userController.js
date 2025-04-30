const bcrypt = require('bcryptjs');
const pool = require('./db');

const createUser = async (req, res) => {
  const { name, username, password } = req.body;

  // Basic validation
  if (!name || !username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Name, username and password are required'
    });
  }

  try {
    // Check if username exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
      [name, username, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: {
        id: result.insertId,
        name,
        username
      }
    });

  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during user creation'
    });
  }
};

module.exports = { createUser };