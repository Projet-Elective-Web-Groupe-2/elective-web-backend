const mongoose = require('mongoose');
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
        required: false
    },
    address: {
        type: String,
        unique: true,
        required: false
    },
    description: {
        type: String,
        unique: false,
        required: false
    },
    status: {
        type: Boolean,
        unique: false,
        required: false
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

module.exports = restaurantSchema;