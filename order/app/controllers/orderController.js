/**
 * Le contrôleur contenant la logique métier associée à chaque route de commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios');
const orderService = require('../services/orderService');
const decodeJWT = require('../utils/decodeToken');

const AUTH_URL = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/`;
const RESTAURANT_URL = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/`;
const PRODUCT_URL = `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/`;
const MENU_URL = `http://${process.env.MENU_HOST}:${process.env.MENU_PORT}/menu/`;

const createAndAddOrder = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;
    
    if (userType != "CLIENT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const itemID = req.body["itemID"];
    console.log("itemID : ", itemID);
    const isMenu = req.body["isMenu"];
    console.log("isMenu : ", isMenu);
    const restaurantID = req.body["restaurantID"];
    console.log("restaurantID : ", restaurantID);

    if (!itemID || isMenu == undefined || !restaurantID ) {
        return res.status(400).json({ error: "Missing mandatory data for order creation" });
    }

    let url;
    let response;

    try {
        url = `${AUTH_URL}find`;
        response = await axios.get(url, {
            params: { id: userID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status != 200) {
            throw new Error("User not found");
        }

        const userAddress = response.data.user.address;

        url = `${RESTAURANT_URL}find`;
        response = await axios.get(url, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status != 200) {
            throw new Error("Restaurant not found");
        }

        let item;

        switch (isMenu) {
            case true:
                url = `${MENU_URL}find`;
                response = await axios.get(url, {
                    params: { id: itemID },
                    headers: { Authorization: `Bearer ${token}` }
                });
                item = response.data.menu;
                break;
            case false:
                url = `${PRODUCT_URL}find`;
                response = await axios.get(url, {
                    params: { id: itemID },
                    headers: { Authorization: `Bearer ${token}` }
                });
                item = response.data.product;
                break;
            default:
                throw new Error("Invalid item type");
        }

        if (response.status != 200) {
            throw new Error("Item not found");
        }

        let order = await orderService.createOrder(item, isMenu, userID, userAddress);

        url = `${RESTAURANT_URL}addOrder`;
        response = await axios.post(url, {
            restaurantID: restaurantID,
            order: order
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status != 201) {
            throw new Error("Order creation failed");
        }

        return res.status(201).json({ message: "Order created" });
    }
    catch (error) {
        if (error.message === "User not found"
            || error.message === "Restaurant not found"
            || error.message === "Item not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Invalid item type") {
            return res.status(400).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while creating an order : ", error);
            return res.status(500).json({ error: "Order creation failed" });
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

        const metrics = await restaurantService.getPerformanceMetrics();

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
    createAndAddOrder,
    metrics
};