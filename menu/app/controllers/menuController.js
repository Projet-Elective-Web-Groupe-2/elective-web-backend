/**
 * Le contrôleur contenant la logique métier associée à chaque route de menu.
 * @author AMARA Ahmed
 * @version 1.0
*/

const axios = require('axios');
const mongoose = require('mongoose');
const menuService = require('../services/menuService');

const createAndAddMenu = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userType = req.decoded.type;

    const productIds = req.body["productIds"];
    let restaurantID = req.body["restaurantID"];
    const name = req.body["name"];
    const image = req.body["image"];
    const drinkButtonClicked = req.body["drinkButtonClicked"]; 
    const drink = drinkButtonClicked ? true : false;
    
    console.log(req.body);

    if (!name || !restaurantID || !productIds || !image) {
        return res.status(400).json({ error: "Missing mandatory data to create menu" });
    }

    try {
        if (userType !== "RESTAURANT") {
            throw new Error("Invalid user type");
        }

        restaurantID = new mongoose.Types.ObjectId(restaurantID);

        let url = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/find`; 
        const restaurantResponse = await axios.get(url, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (restaurantResponse.status !== 200) {
            throw new Error("Restaurant not found");
        }

        const productUrl = `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/getProducts`;
        const productsResponse = await axios.get(productUrl, {
            data: { productIds }, 
            headers: { Authorization: `Bearer ${token}` }
        });
           

        if (productsResponse.status !== 200) {
            throw new Error("Failed to fetch products");
        }

        const products = productsResponse.data.productsInfo;

        const menu = await menuService.createAndAddMenu(name, products, image, drink);

        url = url.replace('find', 'addMenu'); 
        response = await axios.post(url, { 
            restaurantID: restaurantID,
            menu : menu ,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 201) {
            throw new Error("Menu not added");
        }

        return res.status(201).json({ message: 'Menu added successfully' });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            return res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        else if (error.message === "Failed to fetch products") {
            return res.status(400).json({ error: "Failed to fetch products" });
        }
        else if (error.message === "Menu not added") {
            return res.status(400).json({ error: "Menu not added" });
        }
        else if (error.message === "Menu not found") {
            return res.status(404).json({ error: "Menu not found" });
        }
        else {
            console.error("Unexpected error while adding a menu : ", error);
            return res.status(500).json({ error: 'Internal server error'});
        }
    }
};

const findMenu = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const menuID = req.query.id;

    if (!menuID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const menu = await menuService.findMenuByID(menuID);

        if (!menu) {
            throw new Error("Menu not found");
        }

        return res.status(200).json({ menu });
    }
    catch (error) {
        if (error.message === "Menu not found") {
            return res.status(404).json({ error: "Menu not found" });
        }
        else {
            console.error("Unexpected error while finding a menu : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const updatedMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const menuID = req.body["menuID"];
    const productID = req.body["productID"];
    const userType = req.decoded.type;

    try {
        if (userType !== "RESTAURANT" && userType !== "CLIENT") {
            throw new Error("Invalid user type");
        }

        if (!menuID || !productID) {
            throw new Error("Missing mandatory data");
        }

        const productResponse = await axios.get(`http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/getProducts`, {
            data: { productIds }, 
            headers: { Authorization: `Bearer ${token}` }
        });

        if (productResponse.status !== 200) {
            throw new Error("Product not found");
        }

        const products = productResponse.data.productsInfo;

        const updatedMenu = await menuService.updateMenu(menuID, products);
        
        return res.status(200).json({ message: "Product added to menu successfully", menu: updatedMenu });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            return res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Missing mandatory data") {
            return res.status(400).json({ error: "Missing mandatory data" });
        }
        else if (error.message === "Product not found") {
            return res.status(404).json({ error: "Product not found" });
        }
        else if (error.message === "Menu not found") {
            return res.status(404).json({ error: "Menu not found" });
        }
        else {
            console.error("Error while adding product to menu: ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const metrics = async (req, res) => {
    const userType = req.decoded.type;

    try {
        if (userType !== "TECHNICAL") {
            throw new Error("Invalid user type");
        }

        const metrics = await menuService.getPerformanceMetrics();

        return res.status(200).json({ metrics });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting metrics : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = {
    createAndAddMenu,
    findMenu,
    updatedMenu,
    metrics,
};