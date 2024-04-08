/**
 * Le schéma représentant un restaurant.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Menu = require('../models/menuModel');
const Order = require('../models/orderModel');

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
    products : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: false,
        required: false
    }],
    orders : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        unique: false,
        required: false
    }]
});

restaurantSchema.virtual('menuDetails', {
    ref: 'Menu',
    localField: 'menus',
    foreignField: '_id',
    justOne: false
});

restaurantSchema.virtual('productDetails', {
    ref: 'Product',
    localField: 'products',
    foreignField: '_id',
    justOne: false
});

restaurantSchema.virtual('orderDetails', {
    ref: 'Order',
    localField: 'orders',
    foreignField: '_id',
    justOne: false
});

restaurantSchema.set('toObject', { virtuals: true });
restaurantSchema.set('toJSON', { virtuals: true });

module.exports = restaurantSchema;