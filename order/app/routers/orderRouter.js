/**
 * Le routeur pour les commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createAndAddOrder);
router.post('/update', orderController.updateOrderStatus);
router.get('/metrics', orderController.metrics);

module.exports = router;