const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add', productController.addProductToRestaurant);
router.get('/metrics',productController.metrics );

module.exports = router;
