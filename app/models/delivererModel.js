/**
 * Le modèle représentant un livreur.
 * @author GAURE Warren
 * @version 1.0
*/

const delivererSchema = require("../schemas/delivererSchema");
const userModel = require("./userModel");

// Définition du modèle pour un livreur basé sur le schéma associé et le modèle de l'utilisateur
// Ça va permettre d'étendre le modèle de base pour que chaque type d'utilisateur puisse utiliser les mêmes fonctionnalités
const delivererModel = userModel.discriminator("Deliverer", delivererSchema);

module.exports = delivererModel;