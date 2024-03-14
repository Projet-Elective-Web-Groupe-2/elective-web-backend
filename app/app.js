// Divers imports
const express = require('express');
const mongoose = require('mongoose');
// TODO : À décommenter une fois le routeur créé
// const routes = require('./routers');
const logger = require('./middlewares/logger');


// On créé l'application avec Express
const app = express();
const port = process.env.PORT || 3000;


// On connecte le serveur à la base de données
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to the database");
})
.catch((error) => {
    console.error("Error while connecting to the database: ", error);
});


// On set up les middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// On set up le router
// TODO : À décommenter une fois le routeur créé
// app.use('/', routes);

/* ----- À SUPPRIMER UNE FOIS LE ROUTEUR FAIT ----- */
// Route de test
app.get('/test', function(req, res) {
    res.send("Hello World !");
});

// Route de test de la connexion à la base de données
app.get('/test-connexion-db', function(req, res) {
    if (mongoose.connection.readyState == 1) {
        res.send("Connected to the database.");
    }
    else {
        res.status(500).send("Error while connecting to the database.");
    }
});
/* ------------------------------------------------ */

// On ouvre le port
app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});

module.exports = app;