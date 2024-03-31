const productService = require('../services/productService');

const addProductToRestaurant = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const { restaurantId, name, description, price } = req.body;

    if (!restaurantId || !name || !description || !price) {
        return res.status(400).json({ error: "Missing mandatory data for adding product" });
    }

    try {
        const result = await productService.addProductToRestaurant(restaurantId, name, description, price);

        if (result.error) {
            return res.status(400).json({ error: result.message });
        }

        res.status(201).json({ message: 'Product added successfully', product: result.product });
    } catch (error) {
        console.error("Error in addProductToRestaurant ", error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

module.exports = {
    addProductToRestaurant,
};
