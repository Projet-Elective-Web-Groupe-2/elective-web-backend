/**
 * Le routeur pour l'authentification
 * @author AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/create', restaurantController.createRestaurant);
// Autres routes à ajouter ici
routeur.get('/metrics', restaurantController.metrics);

module.exports = router;