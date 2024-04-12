/**
 * Le schéma représentant un produit (article).
 * @author GAURE Warren, Amara Ahmed
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour un produit.
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    image: {
        type: String,
        unique: false,
        required: false
    },
    description: {
        type: String,
        unique: false,
        required: true
    },
    price: {
        type: Number,
        unique: false,
        required: true
    },
    isDrink: {
        type: Boolean,
        unique: false,
        required: true
    }
});

module.exports = productSchema;