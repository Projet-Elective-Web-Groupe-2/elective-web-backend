/**
 * Le contrôleur contenant la logique métier associée à chaque route de produits.
 * @author AMARA Ahmed
 * @version 1.0
*/

const axios = require('axios');
const mongoose = require('mongoose');
const productService = require('../services/productService');
const decodeJWT = require('../utils/decodeToken');

const createAndAddProduct = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    const name = req.body["name"];
    const description = req.body["description"];
    const price = req.body["price"];
    let restaurantID = req.body["restaurantID"];

    if (!name || !description || !price || !restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data to add a product" });
    }

    try {
        if (userType != "RESTAURATEUR") {
            throw new Error("Invalid user type");
        }

        restaurantID = new mongoose.Types.ObjectId(restaurantID);

        let url = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/find`;
        
        let response = await axios.get(url, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status != 200) {
            throw new Error("Restaurant not found");
        }

        const product = await productService.createProduct(name, description, price);

        url = url.replace('find', 'addProduct');
        response = await axios.post(url, { 
            restaurantID: restaurantID,
            product: product
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status != 201) {
            throw new Error("Product not added");
        }

        return res.status(201).json({ message: 'Product added successfully', product });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            return res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        else if (error.message === "Product not added") {
            return res.status(500).json({ error: "Product not added" });
        }
        else {
            console.error("Unexpected error while adding a product : ", error);
            res.status(500).json({ error: 'Product adding failed' });
        }
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

const getProductsByIds = async (req, res) => {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ error: "Product IDs are missing or invalid" });
    }

    try {
        const productsInfo = await productService.getProductsByIds(productIds);

        if (productsInfo.length === 0) {
            return res.status(404).json({ error: "No products found with the provided IDs" });
        }

        return res.status(200).json({ productsInfo });
    } catch (error) {
        console.error("Unexpected error while fetching products: ", error);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
};


module.exports = {
    createAndAddProduct,
    metrics,
    getProductsByIds

};