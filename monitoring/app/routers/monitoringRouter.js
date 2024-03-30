/**
 * Le routeur pour le monitoring.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const routeur = express.Router();
const monitoringController = require('../controllers/monitoringController');

routeur.get('/getMetrics', monitoringController.getMetrics);

module.exports = routeur;