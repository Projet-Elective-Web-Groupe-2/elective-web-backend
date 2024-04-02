/**
 * Le fichier principal du microservice d'authentification.
 * @author GAURE Warren, JOURNEL Nicolas, AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

const loggerMiddleware = require('./app/middlewares/loggerMiddleware');

const authenticationRouter = require('./app/routers/authenticationRouter');

const mysql = require('mysql');

require("dotenv").config();

const app = express();

const port = process.env.AUTH_PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error while connecting to MongoDB : ", error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cors());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(loggerMiddleware);

app.use('/auth', authenticationRouter);

/* ----- À SUPPRIMER UNE FOIS LES ROUTES CRÉÉES ----- */
app.get('/hello', function(req, res) {
    res.send("Hello World !");
});

app.get('/mongo', function(req, res) {
    if (mongoose.connection.readyState == 1) {
        res.send("Connected to MongoDB");
    }
    else {
        res.status(500).send("Error while connecting to MongoDB");
    }
});



app.get('/mysql', function(req, res) {
    // Créer une connexion à la base de données MySQL
    const connection = mysql.createConnection({
        host: 'mysql',
        user: 'root', // Nom d'utilisateur MySQL
        port: 3306,
        password: 'example_pass', // Mot de passe MySQL
    });

    // Établir la connexion à la base de données
    connection.connect((err) => {
        if (err) {
            res.status(500).send('Error connecting to MySQL:', err.stack);
            return;
        }
        // Send response with status 200 (OK) and connected thread ID
        res.status(200).send('Connected to MySQL as id ' + connection.threadId);
        console.log("Connected to MySQL");
    });

    // Export the connection
    module.exports = connection;
});
/* -------------------------------------------------- */

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});