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
    delivererID: {
        type: Number,
        unique: false,
        required: false
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
        default: Date.now
    },
    status: {
        type: String,
        enum: [
            "Créée",
            "Paiement refusé",
            "Commande refusée par le restaurateur",
            "En cours de préparation",
            "Commande refusée par le livreur",
            "En cours de livraison",
            "Livrée"
        ],
        unique: false,
        required: true,
        default: 'Créée'
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

orderSchema.virtual('productDetails', {
    ref: 'Product',
    localField: 'products',
    foreignField: '_id',
    justOne: false
});

orderSchema.virtual('menuDetails', {
    ref: 'Menu',
    localField: 'menus',
    foreignField: '_id',
    justOne: false
});

module.exports = orderSchema;