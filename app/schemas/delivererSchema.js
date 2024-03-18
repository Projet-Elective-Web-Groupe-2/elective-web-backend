/**
 * Le schéma représentant un livreur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const userSchema = require("./userSchema");

const delivererSchema = new mongoose.Schema({
    // Le parrain du livreur
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deliverer',
        unique: false,
        required: false
    },
    // Le livreur parrainé par celui-ci
    referrerOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deliverer',
        unique: false,
        required: false
    }
});

delivererSchema.add(userSchema);

module.exports = delivererSchema;