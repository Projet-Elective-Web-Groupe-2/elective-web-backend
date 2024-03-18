/**
 * Le fichier principal du serveur.
 * @author GAURE Warren, GRENOUILLET Théo, JOURNEL Nicolas
 * @version 1.0
*/

// Importation des dépendances
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middlewares/logger');
const authentication = require('./middlewares/authentication');

// Initialisation de l'application avec Express
const app = express();

// Chargement des variables d'environnement
require("dotenv").config();

// Port du serveur
const port = process.env.PORT || 3000;

// On connecte le serveur à la base de données
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to the database");
})
.catch((error) => {
    console.error("Error while connecting to the database: ", error);
});

// Ajout des middlewares au serveur
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(authentication);

/* ----- À SUPPRIMER UNE FOIS LES ROUTES CRÉÉES ----- */
// Route de test
app.get('/test', function(req, res) {
    res.send("Hello World !");
});

// Route de test de la connexion à la base de données
app.get('/test-connexion-db', function(req, res) {
    if (mongoose.connection.readyState == 1) {
        res.send("Connected to the database");
    }
    else {
        res.status(500).send("Error while connecting to the database");
    }
});
/* ------------------------------------------------ */

// Ouverture du port
app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});