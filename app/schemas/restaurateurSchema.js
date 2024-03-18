/**
 * Le schéma représentant un restaurateur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const userSchema = require("./userSchema");

const restaurateurSchema = new mongoose.Schema({
    // Le parrain du restaurateur
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurateur',
        unique: false,
        required: false
    },
    // Le restaurateur parrainé par celui-ci
    referrerOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurateur',
        unique: false,
        required: false
    }
});

restaurateurSchema.add(userSchema);

module.exports = restaurateurSchema;