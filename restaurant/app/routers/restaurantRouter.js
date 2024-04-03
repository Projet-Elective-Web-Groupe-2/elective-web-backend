/**
 * Le routeur pour l'authentification
 * @author AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/create', restaurantController.createRestaurant);
router.get('/find', restaurantController.findRestaurant);
router.post('/addProduct', restaurantController.addProduct);
router.get('/metrics', restaurantController.metrics);

module.exports = router;