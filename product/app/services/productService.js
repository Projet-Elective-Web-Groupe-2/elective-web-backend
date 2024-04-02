const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');

async function addProductToRestaurant(restaurantId, name, description, price) {
    try {
        const newProduct = await Product.create({ name, description, price });

        await Restaurant.findByIdAndUpdate(restaurantId, { $push: { products: newProduct._id } }, { new: true, useFindAndModify: false });
        return { error: false, product: newProduct };
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    addProductToRestaurant,
};
