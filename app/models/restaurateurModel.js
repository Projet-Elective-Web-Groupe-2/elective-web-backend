/**
 * Le modèle représentant un restaurateur.
 * @author GAURE Warren
 * @version 1.0
*/

const restaurateurSchema = require("../schemas/restaurateurSchema");
const userModel = require("./userModel");

// Définition du modèle pour un restaurateur basé sur le schéma associé et le modèle de l'utilisateur
// Cela va permettre d'étendre le modèle de base pour que chaque type d'utilisateur puisse utiliser les mêmes fonctionnalités
const restaurateurModel = userModel.discriminator("Restaurateur", restaurateurSchema);

module.exports = restaurateurModel;