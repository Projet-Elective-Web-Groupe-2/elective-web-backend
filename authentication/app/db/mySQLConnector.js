const mysql = require('mysql');

// Créer une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: "mysql", // Utilisation du nom d'hôte défini dans Docker Compose
  user: 'root', // Nom d'utilisateur MySQL
  port:3306,
  socketPath: '/var/lib/mysqld/mysqld.sock', /*example: /Applications/MAMP/tmp/mysql/mysql.sock*/

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
