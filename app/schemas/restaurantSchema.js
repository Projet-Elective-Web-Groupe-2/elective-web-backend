const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: false },
    image: { type: String, required: false },
    ownerID: { type: Number, required: true },
    description: { type: String, required: false },
    status: { type: Boolean, required: false },
    openingHours: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: false }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
