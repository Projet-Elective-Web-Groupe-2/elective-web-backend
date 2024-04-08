/**
 * Le routeur pour les articles
 * @author AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add', productController.createAndAddProduct);
router.get('/find', productController.findProduct);
router.get('/metrics', productController.metrics);
router.get('/getProducts',productController.getProductsByIds);

module.exports = router;