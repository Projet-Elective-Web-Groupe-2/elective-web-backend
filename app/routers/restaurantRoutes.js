const express = require('express');
const restaurantController = require('../controllers/RestauController');
const router = express.Router();

router.post('/', restaurantController.createRestaurant);

router.get('/', restaurantController.getAllRestaurants);

router.get('/:id', restaurantController.getRestaurantById);

router.put('/:id', restaurantController.updateRestaurant);

router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;
