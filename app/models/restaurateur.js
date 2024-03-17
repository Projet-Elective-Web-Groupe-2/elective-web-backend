/**
 * Le modèle représentant un restaurateur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const restaurateurSchema = require("../schemas/restaurateur").restaurateurSchema;

// Définition du modèle pour un restaurateur basé sur le schéma associé
const restaurateurModel = mongoose.model("Restaurateur", restaurateurSchema);

module.exports = restaurateurModel;