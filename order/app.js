/**
 * Le fichier principal du microservice des restaurants.
 * @author GAURE Warren, Amara Ahmed
 * @version 1.0
*/

const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');
const restaurantRoutes = require('./app/routers/restaurantRouter');
const mongoose = require('mongoose');


const loggerMiddleware = require('./app/middlewares/loggerMiddleware');
const authenticationMiddleware = require('./app/middlewares/authenticationMiddleware');

require("dotenv").config();

const app = express();

const port = process.env.RESTAURANT_PORT || 3005;
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
app.post('/test', (req, res) => {
    res.status(200).send('Test endpoint is working');
  });  



app.use(loggerMiddleware);
app.use(authenticationMiddleware);

app.get('/hello', function(req, res) {
    res.send("Hello World !");
});

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});