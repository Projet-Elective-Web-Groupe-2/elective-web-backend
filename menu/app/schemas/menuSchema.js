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
    description: {
        type: String, 
        unique: false,
        required: true
    },
    image: {
        type: String,
        unique: false,
        required: false,
        default: ''
    },
    products : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: false,
        required: true
    }],
    totalPrice: {
        type: Number,
        unique: false,
        required: true
    },
    drink: {
        type: Boolean,
        default: false
    }
});

module.exports = menuSchema;