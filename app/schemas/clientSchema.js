/**
 * Le schéma représentant un client.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const userSchema = require("./userSchema");

// Définition du schéma d'un client
const clientSchema = new mongoose.Schema({
    // Le parrain du client
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        unique: false,
        required: false
    },
    // Le client parrainé par celui-ci
    referrerOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        unique: true,
        required: false
    }
});

clientSchema.add(userSchema);

module.exports = clientSchema;