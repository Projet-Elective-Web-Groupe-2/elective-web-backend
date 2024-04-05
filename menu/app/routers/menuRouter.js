// route pour get le menu en fonction de son id (find restaurant ca retourne l'objet)   
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/create', menuController.createAndAddMenu);
// router.get('./find', menuController.findMenu);

router.get('/metrics', menuController.metrics);

module.exports = router;
