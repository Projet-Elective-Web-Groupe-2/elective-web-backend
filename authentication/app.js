/**
 * Le fichier principal de l'application.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

// Importation des middlewares
const cors = require('cors');
const loggerMiddleware = require('../shared/middlewares/loggerMiddleware');
const authenticationMiddleware = require('../shared/middlewares/authenticationMiddleware');

// Importation des routes
const authenticationRouter = require('./routers/authenticationRouter');

// Chargement des variables d'environnement
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to the database");
})
.catch((error) => {
    console.error("Error while connecting to the database : ", error);
});

// Ajout des composants à l'application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(loggerMiddleware);
app.use(authenticationMiddleware);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Ajout des routes à l'application
app.use('/auth', authenticationRouter);

/* ----- À SUPPRIMER UNE FOIS LES ROUTES CRÉÉES ----- */
// Route de test
app.get('/test', function(req, res) {
    res.send("Hello World !");
});

// Route de test de la connexion à la base de données
app.get('/test-mongo', function(req, res) {
    if (mongoose.connection.readyState == 1) {
        res.send("Connected to the database");
    }
    else {
        res.status(500).send("Error while connecting to the database");
    }
});

// Route de healthcheck
app.get('/healthcheck', (_req, res) => {
    res.status(200).json({ health: 'OK' })
});
/* -------------------------------------------------- */

// Ouverture du port
app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});