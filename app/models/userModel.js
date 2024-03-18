/**
 * Le modèle représentant un utilisateur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const userSchema = require("../schemas/userSchema");

// Définition du modèle pour un utilisateur basé sur le schéma associé
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;