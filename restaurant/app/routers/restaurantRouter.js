const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const router = express.Router();

router.post('/creer', restaurantController.createRestaurant);

module.exports = router;
