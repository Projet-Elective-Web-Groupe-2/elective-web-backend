/**
 * Le fichier principal de l'application.
 * @author GAURE Warren, JOURNEL Nicolas, AMARA Ahmed
 * @version 1.0
*/

const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

require("dotenv").config();

const app = require('../shared/appConfig');
const port = process.env.PORT || 3000;

const authenticationRouter = require('./routers/authenticationRouter');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to the database");
})
.catch((error) => {
    console.error("Error while connecting to the database : ", error);
});


app.use(mongoSanitize());

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