/**
 * Le schéma représentant un restaurant.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour un restaurant.
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: Number,
        unique: false,
        required: true
    },
    address: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: false,
        required: false
    },
    status: {
        type: String,
        unique: false,
        required: false
    },
    openingHours: {
        type: String,
        unique: false,
        required: true
    },
    menus : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        unique: false,
        required: false
    }],
    products : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: false,
        required: false
    }],
});

module.exports = restaurantSchema;