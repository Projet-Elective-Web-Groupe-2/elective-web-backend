/**
 * Le routeur pour les commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createAndAddOrder);
//router.post('/addMenu', orderController.addMenu);
//router.post('/addProduct', orderController.addProduct);
//router.get('/get', orderController.getOrder);
//router.get('/ordersOfUser', orderController.listOrdersFromUser);
//router.get('/ordersOfRestaurant', orderController.listOrdersFromRestaurant);
//router.delete('/delete', orderController.deleteOrder);
router.get('/metrics', orderController.metrics);

module.exports = router;