const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  port: 3306,
  password: 'example_pass',
  database: 'elective',
});

// Handle connection errors
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database with connection id ' + connection.threadId);
});

module.exports = connection;
