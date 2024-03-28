/**
 * Le fichier contenant la configuration de base de l'instance Express d'un microservice.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

module.exports = app;