const express = require('express');
const { json, urlencoded } = require('express');
const { connect } = require('mongoose');
const routes = require('./routers');

const app = express();

// On set up les middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// On set up la base de données
connect('mongodb://localhost/myapp', { useNewUrlParser: true });

// On set up le router
app.use('/', routes);

module.exports = app;