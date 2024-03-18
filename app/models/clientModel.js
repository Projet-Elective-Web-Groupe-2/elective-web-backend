/**
 * Le modèle représentant un client.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const clientSchema = require("../schemas/clientSchema");

// Définition du modèle pour un client basé sur le schéma associé
const clientModel = mongoose.model("Client", clientSchema);

module.exports = clientModel;