/**
 * Le routeur pour les articles
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add', productController.createAndAddProduct);
router.get('/find', productController.findProduct);
router.get('/getProducts', productController.getProductsByIds);
router.get('/getDrinks', productController.getDrinks);
router.delete('/delete', productController.deleteProduct);
router.get('/metrics', productController.metrics);

module.exports = router;