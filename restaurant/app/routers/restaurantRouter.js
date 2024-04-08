/**
 * Le routeur pour les restaurants.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/create', restaurantController.createRestaurant);
router.get('/find', restaurantController.findRestaurant);
router.get('/delete', restaurantController.deleteRestaurant);
router.post('/addProduct', restaurantController.addProduct);
router.post('/addOrder', restaurantController.addOrder);
router.post('/updateOrder', restaurantController.updateOrder);
router.get('/getOrdersSince', restaurantController.getOrdersSince);
router.get('/metrics', restaurantController.metrics);

module.exports = router;