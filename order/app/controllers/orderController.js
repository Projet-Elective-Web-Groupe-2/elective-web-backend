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

    const items = req.body["items"];
    const restaurantID = req.body["restaurantID"];

    if (!items || !restaurantID ) {
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

        let totalPrice = 0;

        for (let item of items) {
            const itemID = item.idProduit;
            const isMenu = item.isMenu;
            const drinkID = item.drink;

            if (!itemID || isMenu == undefined || (isMenu && drinkID == undefined)) {
                throw new Error("Missing mandatory data for item verification");
            }

            if (isMenu) {
                url = `${MENU_URL}find`;
                response = await axios.get(url, {
                    params: { id: itemID },
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.status != 200) {
                    throw new Error("Menu not found");
                }

                totalPrice += response.data.menu.totalPrice;

                if (drinkID) {
                    url = `${PRODUCT_URL}find`;
                    response = await axios.get(url, {
                        params: { id: drinkID },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                if (response.status != 200) {
                    throw new Error("Menu not found");
                }

                const drink = response.data.product;

                totalPrice += drink.price;

                // TODO : Potentiellement devoir changer le nom de la route
                url = `${MENU_URL}addProduct`;
                response = await axios.post(url, {
                    menuID: itemID,
                    product: drink,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status != 201) {
                    throw new Error("Drink not added to menu");
                }
            }
            else {
                url = `${PRODUCT_URL}find`;
                response = await axios.get(url, {
                    params: { id: itemID },
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.status != 200) {
                    throw new Error("Product not found");
                }

                totalPrice += response.data.product.price;
            }
        }

        let order = await orderService.createOrder(items, userID, userAddress, totalPrice);

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

        return res.status(201).json({ order });
    }
    catch (error) {
        if (error.message === "User not found" 
            || error.message === "Restaurant not found"
            || error.message === "Item not found"
            || error.message === "Menu not found"
            || error.message === "Drink not found"
            || error.message === "Drink not added to menu") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for order creation") {
            return res.status(400).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for item verification") {
            return res.status(400).json({ error: error.message });
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