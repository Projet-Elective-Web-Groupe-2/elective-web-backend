/**
 * Le fichier principal du microservice des utilisateurs.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

const loggerMiddleware = require('./app/middlewares/loggerMiddleware');
const authenticationMiddleware = require('./app/middlewares/authenticationMiddleware');

const usersRouter = require('./app/routers/usersRouter');

require("dotenv").config();

const app = express();

const port = process.env.USERS_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cors());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(loggerMiddleware);
app.use(authenticationMiddleware);

app.use('/user', usersRouter);

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});