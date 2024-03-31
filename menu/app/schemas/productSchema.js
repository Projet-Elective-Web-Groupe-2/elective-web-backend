/**
 * Le schéma représentant un produit (article).
 * @author GAURE Warren
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
    restaurantId:
     { type: mongoose.Schema.Types.ObjectId,
         ref: 'Restaurant',
          required: true },

});

module.exports = productSchema;