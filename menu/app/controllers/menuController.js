const axios = require('axios');
const mongoose = require('mongoose');
const menuService = require('../services/menuService');

const createAndAddMenu = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    const productIds = req.body["productIds"];
    let restaurantID = req.body["restaurantID"];
    const name = req.body["name"];
    let image = req.body["image"];

    if (!name || !restaurantID || !productIds) {
        return res.status(400).json({ error: "Missing mandatory data to add a product" });
    }

    try {
        if (userType !== "RESTAURATEUR") {
            throw new Error("Invalid user type");
        }

        restaurantID = new mongoose.Types.ObjectId(restaurantID);

        const restaurantUrl = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/find`;
        const restaurantResponse = await axios.get(restaurantUrl, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (restaurantResponse.status !== 200) {
            throw new Error("Restaurant not found");
        }

        const productUrl = `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/getProductsByIds`;
        const productsResponse = await axios.get(productUrl, {
            params: { productIds },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (productsResponse.status !== 200) {
            throw new Error("Failed to fetch products");
        }

        const products = productsResponse.data.productsInfo;

        // Créer le menu en utilisant les produits récupérés
        const menu = await menuService.createMenu(name, products);

        res.status(201).json({ message: 'Menu added successfully' });
    } catch (error) {
        if (error.message === "Invalid user type") {
            return res.status(403).json({ error: "Forbidden" });
        } else if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: "Restaurant not found" });
        } else {
            console.error("Unexpected error while adding a menu : ", error);
            res.status(500).json({ error: 'Menu adding failed' });
        }
    }
};

const metrics = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    try {
        if (userType !== "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        const metrics = await menuService.getPerformanceMetrics();

        return res.status(200).json({ metrics });
    } catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        } else {
            console.error("Unexpected error while getting metrics : ", error);
            res.status(500).json({ error: "Metrics collecting failed" });
        }
    }
};

module.exports = {
    createAndAddMenu,
    metrics
};
