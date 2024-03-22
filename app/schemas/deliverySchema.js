/**
 * Le schéma représentant une livraison.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour une livraison.
const deliverySchema = new mongoose.Schema({
    delivererID: {
        type: Number,
        unique: false,
        required: true,
    },
    address: {
        type: String,
        unique: false,
        required: true,
    },
    date: {
        type: Date,
        unique: false,
        required: true,
    },
    status: {
        type: Boolean,
        unique: false,
        required: true,
    }
});

module.exports = deliverySchema;