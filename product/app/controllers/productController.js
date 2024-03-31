const productService = require('../services/productService');

const addProductToRestaurant = async (req, res) => {
    try {
        const { restaurantId, name, description, price } = req.body;
        console.log("Request Body:", req.body);

        const result = await productService.addProductToRestaurant(restaurantId, name, description, price);
        console.log("Result:", result);

        if (result.error) {
            return res.status(400).json({ error: result.message });
        }

        res.status(201).json({ message: 'Product added successfully', product: result.product });
    } catch (error) {
        console.error("Error in addProductToRestaurant controller:", error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

module.exports = {
    addProductToRestaurant,
};
