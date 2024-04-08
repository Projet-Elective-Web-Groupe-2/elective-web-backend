/**
 * Le routeur pour les menus.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/create', menuController.createAndAddMenu);
router.get('/find', menuController.findMenu);
router.post('/update', menuController.updatedMenu),
router.get('/metrics', menuController.metrics);

module.exports = router;