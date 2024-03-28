/**
 * Le routeur pour l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const express = require('express');
const routeur = express.Router();
const authenticationController = require('../controllers/authenticationController');

routeur.post('/login', authenticationController.login);
routeur.post('/logout', authenticationController.logout);
routeur.post('/register', authenticationController.register);

module.exports = routeur;