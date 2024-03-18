/**
 * Le modèle représentant un livreur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const delivererSchema = require("../schemas/delivererSchema");

// Définition du modèle pour un livreur basé sur le schéma associé
const delivererModel = mongoose.model("Deliverer", delivererSchema);

module.exports = delivererModel;