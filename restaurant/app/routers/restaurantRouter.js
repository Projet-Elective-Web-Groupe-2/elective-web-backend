/**
 * Le routeur pour l'authentification
 * @author AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/creer', restaurantController.createRestaurant);

module.exports = router;