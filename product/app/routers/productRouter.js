const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/ajouter', productController.addProductToRestaurant);

module.exports = router;
