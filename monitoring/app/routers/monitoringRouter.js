/**
 * Le routeur pour le monitoring.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');

router.get('/getMetrics', monitoringController.getMetrics);

module.exports = router;