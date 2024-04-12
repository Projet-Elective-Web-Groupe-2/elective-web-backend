/**
 * Le routeur pour les livraisons.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/accept', deliveryController.acceptDelivery);
router.post('/refuse', deliveryController.refuseDelivery);
router.get('/getAllWithFilter', deliveryController.getAllWithFilter);
router.get('/getStatut', deliveryController.getStatut);
router.get('/trackDelivery', deliveryController.trackDelivery);
router.post('/nearby', deliveryController.nearbyDelivery);
router.post('/validate', deliveryController.validateDelivery);
router.get('/metrics', deliveryController.metrics);

module.exports = router;