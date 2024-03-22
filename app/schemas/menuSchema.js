/**
 * Le schéma représentant un menu.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour une livraison.
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    products : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: false,
        required: false
    }],
    totalPrice: {
        type: Number,
        unique: false,
        required: true
    }
});

module.exports = menuSchema;