/**
 * Le modèle représentant un restaurant.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const restaurantSchema = require('../schemas/restaurantSchema');

// Définition du modèle pour un restaurant.
const restaurantModel = mongoose.model('Restaurant', restaurantSchema);

module.exports = restaurantModel;