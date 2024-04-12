/**
 * Le module de connexion à la base de données MySQL.
 * @author JOURNEL Nicolas
 * @version 1.0
*/

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  port: 3306,
  password: 'example_pass',
  database: 'elective',
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database with connection id ' + connection.threadId);
});

module.exports = connection;