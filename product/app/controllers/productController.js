const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');

exports.addProductToRestaurant = async (req, res) => {
    try {
        const { restaurantId, name, description, price } = req.body;
        const newProduct = await Product.create({ name, description, price, restaurantId });
        
        await Restaurant.findByIdAndUpdate(restaurantId, { $push: { products: newProduct._id } });

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
