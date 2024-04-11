/**
 * Le routeur pour les commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create', orderController.createAndAddOrder);
router.get('/getOrder', orderController.getOrder);
router.post('/update', orderController.updateOrderStatus);
router.get('/getAllFromUser', orderController.getAllFromUser);
router.get('/getAllOrders', orderController.getAllOrders);
router.get('/getAllOrdersFromRestaurant', orderController.getAllOrdersFromRestaurant);
router.get('/getAllCreatedOrdersFromRestaurant', orderController.getAllCreatedOrdersFromRestaurant);
router.post('/getOrdersCountByDay', orderController.countOrdersByDay);
router.get('/metrics', orderController.metrics);

module.exports = router;