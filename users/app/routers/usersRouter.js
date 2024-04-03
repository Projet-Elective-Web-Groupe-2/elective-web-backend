/**
 * Le routeur pour les utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const express = require('express');
const router =  express.Router();
const usersController = require('../controllers/usersController');

router.get('/get', usersController.getUser);
router.get('/getall', usersController.getAllUsers);
router.post('/edit', usersController.editUser);
router.post('/suspend', usersController.suspendUser);
router.post('/unsuspend', usersController.unsuspendUser);
router.delete('/delete', usersController.deleteUser);
router.get('/metrics', usersController.metrics);

module.exports = router;