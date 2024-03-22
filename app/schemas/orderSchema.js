/**
 * Le schéma représentant une commande.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour une commande.
const orderSchema = new mongoose.Schema({
    clientID: {
        type: Number,
        unique: false,
        required: true
    },
    restaurantID: {
        type: String,
        unique: false,
        required: true
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
    totalPrice: {
        type: Number,
        unique: false,
        required: true,
    }
});

module.exports = orderSchema;