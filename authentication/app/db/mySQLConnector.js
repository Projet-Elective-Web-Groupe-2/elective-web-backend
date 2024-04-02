setTimeout(function(){

const mysql = require('mysql');

// Créer une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root', // Nom d'utilisateur MySQL
  port:3306,
  password: 'example_pass', // Mot de passe MySQL
});

// Établir la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

module.exports = connection;

}, 5 * 1000);