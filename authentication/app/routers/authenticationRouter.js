/**
 * Le routeur pour l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);
router.post('/register', authenticationController.register);
router.get('/find', authenticationController.findUser);
router.get('/refreshToken', authenticationController.token);
router.get('/logs', authenticationController.logs);
router.get('/metrics', authenticationController.metrics);

module.exports = router;