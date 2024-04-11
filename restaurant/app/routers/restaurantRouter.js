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
router.get('/findByOwner', restaurantController.findRestaurantByOwnerID);
router.delete('/delete', restaurantController.deleteRestaurant);
router.post('/edit', restaurantController.editRestaurant);
router.get('/getAll', restaurantController.getAllRestaurants);
router.post('/changeStatus', restaurantController.changeStatus);
router.post('/addMenu', restaurantController.addMenu);
router.post('/addProduct', restaurantController.addProduct);
router.post('/addOrder', restaurantController.addOrder);
router.post('/updateOrder', restaurantController.updateOrder);
router.get('/getOrdersSince', restaurantController.getOrdersSince);
router.get('/getOrderCount', restaurantController.getOrderCount);
router.get('/metrics', restaurantController.metrics);

module.exports = router;