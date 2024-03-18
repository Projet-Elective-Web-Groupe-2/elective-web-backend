/**
 * Le modèle représentant un client.
 * @author GAURE Warren
 * @version 1.0
*/

const clientSchema = require("../schemas/clientSchema");
const userModel = require("./userModel");

// Définition du modèle pour un client basé sur le schéma associé et le modèle de l'utilisateur
// Cela va permettre d'étendre le modèle de base pour que chaque type d'utilisateur puisse utiliser les mêmes fonctionnalités
const clientModel = userModel.discriminator("Client", clientSchema);

module.exports = clientModel;