/**
 * Le routeur pour les menus.
 * @author AMARA Ahmed
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/create', menuController.createAndAddMenu);
router.get('/find', menuController.findMenu);
router.delete('/delete', menuController.deleteMenu);
router.post('/update', menuController.updateMenu);
router.post('/removeProduct', menuController.removeProduct);
router.get('/metrics', menuController.metrics);

module.exports = router;