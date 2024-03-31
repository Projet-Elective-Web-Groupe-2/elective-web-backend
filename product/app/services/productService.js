const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');

async function addProductToRestaurant({ restaurantId, productData }) {
    try {
        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return { error: true, statusCode: 404, message: "Restaurant not found." };
        }

        const newProduct = await Product.create(productData);

        await Restaurant.findByIdAndUpdate(restaurantId, { $push: { products: newProduct._id } }, { new: true, useFindAndModify: false });

        return { error: false, product: newProduct };
    } catch (error) {
        if (error.name === 'ValidationError') {
            return { error: true, statusCode: 400, message: "Validation error: " + error.message };
        } else if (error.name === 'MongoError' && error.code === 11000) {
            return { error: true, statusCode: 409, message: "Duplicate key error." };
        } else {
            console.error("Unexpected error in addProductToRestaurant:", error);
            return { error: true, statusCode: 500, message: "An unexpected error occurred." };
        }
    }
}

module.exports = {
    addProductToRestaurant,
};
