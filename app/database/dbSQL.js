/**
 * Le fichier permettant de gérer la connexion à la base de données MySQL.
 * @author GAURE Warren
 * @version 1.0
*/

const Sequelize = require('sequelize');

// Configuration de la base de données
const dbConfig = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: false
};

// Initialisation de la connexion à la base de données
function initializeDatabase() {
  const sequelize = new Sequelize(dbConfig);

  sequelize.authenticate()
  .then(() => {
    console.log("Connected to the MySQL database");
  })
  .catch((error) => {
    console.error("Error while connecting to the MySQL database", error.message);
  });

  return sequelize;
}

module.exports = initializeDatabase;