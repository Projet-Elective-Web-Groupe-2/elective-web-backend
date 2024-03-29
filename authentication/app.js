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

app.get('/healthcheck', (_req, res) => {
    res.status(200).json({ health: 'OK' })
});
/* -------------------------------------------------- */

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});