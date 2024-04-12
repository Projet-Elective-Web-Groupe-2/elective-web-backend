/**
 * Le fichier principal du microservice de monitoring.
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

const monitoringRouter = require('./app/routers/monitoringRouter');

require("dotenv").config();

const app = express();

const port = process.env.MONITORING_PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(loggerMiddleware);
app.use(authenticationMiddleware);

app.use('/monitoring', monitoringRouter);

app.get('/hello', function(req, res) {
    res.send("Hello World !");
});

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});