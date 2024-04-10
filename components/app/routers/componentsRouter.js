/**
 * Le routeur pour les composants.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const componentsController = require('../controllers/componentsController');

router.get('/writeLogs', componentsController.writeLogs);
router.get('/getLogs', componentsController.getlogs);
router.get('/metrics', componentsController.metrics);

module.exports = router;