const productService = require('../services/productService');

const metrics = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    try {
        if (userType != "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        const metrics = await productService.getPerformanceMetrics();

        return res.status(200).json({ metrics });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting metrics : ", error);
            res.status(500).json({ error: "Metrics collecting failed" });
        }
    }
};

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
    metrics,
};
