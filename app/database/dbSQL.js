/**
 * Le fichier permettant de gérer la connexion à la base de données MySQL.
 * @author GAURE Warren
 * @version 1.0
*/

const mysql = require('mysql2');

// Configuration de la base de données
const config = {
  host: "172.21.0.3",
  user: "root",
  password: "password",
  database: "test_db",
  port: 3306
};

// Initialisation de la connexion à la base de données
function initializeDatabase() {
  const dbMySQL = mysql.createConnection(config);
  dbMySQL.connect();
}

module.exports = initializeDatabase;