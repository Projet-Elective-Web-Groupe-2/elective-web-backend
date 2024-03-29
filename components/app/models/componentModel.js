/**
 * Le modèle représentant un composant.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const componentSchema = require('../schemas/componentSchema');

// Définition du modèle pour un composant.
const componentModel = mongoose.model('Component', componentSchema);

module.exports = componentModel;