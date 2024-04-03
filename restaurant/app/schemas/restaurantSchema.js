/**
 * Le schéma représentant un restaurant.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const productSchema = require('./productSchema');


// Définition du schéma pour un restaurant.
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        unique: false,
        required: false,
    },
    ownerID: {
        type: Number,
        unique: true,
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
        type: Boolean,
        unique: false,
        required: true,
        default: true
    },
    menus : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        unique: false,
        required: false
    }],
    products: [productSchema], 

    orders : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        unique: false,
        required: false
    }]
});

module.exports = restaurantSchema;