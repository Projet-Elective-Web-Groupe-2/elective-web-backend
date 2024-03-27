const mysql = require('mysql2/promise');

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'database',  
    user: 'admin', 
    password: 'admin',  
    database: 'electiveWeb', 
  });
  return connection;
}

module.exports = { connectToDatabase };
