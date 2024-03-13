const express = require('express');
const { json, urlencoded } = require('express');
const { connect } = require('mongoose');
// const routes = require('./routers');
const logger = require('./middlewares/logger');

const app = express();

// On set up les middlewares
app.use(json());
app.use(logger);
app.use(urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send("Hello World !");
});

app.listen(3000, function() {
    console.log("Écoute le port 3000");
});

// On set up la base de données
// connect('mongodb://localhost/myapp', { useNewUrlParser: true });

// On set up le router
// app.use('/', routes);

module.exports = app;