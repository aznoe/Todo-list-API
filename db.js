const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET, // Crucial for MAMP on macOS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Enhanced connection test
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL via MAMP');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Test query result:', rows[0].solution);
    
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    console.log('\nTroubleshooting Info:');
    console.log('- MAMP MySQL running?', 'Check MAMP status light');
    console.log('- Correct socket path?', process.env.DB_SOCKET);
    console.log('- Try these connection options:');
    console.log('  1. Use 127.0.0.1 instead of localhost');
    console.log('  2. Try without port (MAMP sometimes uses socket only)');
    console.log('  3. Verify MySQL port in MAMP preferences');
    return false;
  }
}

// Run connection test when this module loads
testConnection();

module.exports = pool;