/**
 * Le contrôleur contenant la logique métier associée à chaque route de produits.
 * @author AMARA Ahmed
 * @version 1.0
*/

const axios = require('axios');
const productService = require('../services/productService');
const decodeJWT = require('../utils/decodeToken');

const createProductAndAdd = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const { restaurantId, name, description, price } = req.body;

    if (!restaurantId || !name || !description || !price) {
        return res.status(400).json({ error: "Missing mandatory data to add a product" });
    }

    try {
        const result = await productService.createProduct(name, description, price);

        if (result.error) {
            return res.status(400).json({ error: result.message });
        }

        res.status(201).json({ message: 'Product added successfully' });
    }
    catch (error) {
        console.error("Unexpected error while adding a product :", error);
        res.status(500).json({ error: 'Product adding failed' });
    }
};

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

module.exports = {
    addProductToRestaurant: createProductAndAdd,
    metrics,
};