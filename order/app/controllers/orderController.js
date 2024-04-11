/**
 * Le contrôleur contenant la logique métier associée à chaque route de commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios');
const orderService = require('../services/orderService');

const AUTH_URL = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/`;
const RESTAURANT_URL = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/`;
const PRODUCT_URL = `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/`;
const MENU_URL = `http://${process.env.MENU_HOST}:${process.env.MENU_PORT}/menu/`;

const createAndAddOrder = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;
    
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

            if (!itemID || isMenu === undefined || !drinkID) {
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

                if (drinkID != "") {
                    url = `${PRODUCT_URL}find`;
                    response = await axios.get(url, {
                        params: { id: drinkID },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                

                    if (response.status != 200) {
                        throw new Error("Drink not found");
                    }

                    const drink = response.data.product;

                    totalPrice += drink.price;

                    url = `${MENU_URL}updateMenu`;
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
            || error.message === "Product not found"
            || error.message === "Drink not added to menu") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Order creation failed") {
            return res.status(500).json({ error: error.message });
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
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getOrder = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT" && userType != "DELIVERY") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const orderID = req.query["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for order retrieval" });
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

        const order = await orderService.findOrderByID(orderID);

        if (!order) {
            throw new Error("Order not found");
        }

        return res.status(200).json({ order });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "Order not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for order retrieval") {
            return res.status(400).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting order : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const updateOrderStatus = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;

    const orderID = req.body["orderID"];
    const restaurantID = req.body["restaurantID"];
    const newStatus = req.body["statut"];

    if (!orderID || !newStatus) {
        return res.status(400).json({ error: "Missing mandatory data for order status update" });
    }

    const possibleStatuses = [
        "Created",
        "Payment refused",
        "Order refused by restaurateur",
        "In preparation",
        "Being delivered",
        "Delivery near client",
        "Delivered"
    ];

    if (!possibleStatuses.includes(newStatus)) {
        return res.status(400).json({ error: "Invalid status" });
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

        url = `${RESTAURANT_URL}find`;
        response = await axios.get(url, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status != 200) {
            throw new Error("Restaurant not found");
        }

        const order = await orderService.findOrderByID(orderID);

        if (!order) {
            throw new Error("Order not found");
        }

        await orderService.updateOrderStatus(orderID, newStatus);

        url = `${RESTAURANT_URL}updateOrder`;
        response = await axios.post(url, {
            orderID: orderID,
            restaurantID: restaurantID,
            newStatus: newStatus
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status != 200) {
            throw new Error("Order status update failed");
        }

        return res.status(200).json({ message: "Order status updated" });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "Restaurant not found" || error.message === "Order not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Invalid status") {
            return res.status(400).json({ error: error.message });
        }
        else if (error.message === "Order status update failed") {
            return res.status(400).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for order status update") {
            return res.status(400).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while updating order status : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getAllFromUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "CLIENT") {
        return res.status(403).json({ error: "Forbidden" });
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

        const orders = await orderService.getAllOrdersFromUser(userID);

        return res.status(200).json({ orders });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "No orders found for this user") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting user's orders : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getAllOrders = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "SALES") {
        return res.status(403).json({ error: "Forbidden" });
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

        const orders = await orderService.getAllOrders();

        if (!orders || orders.length === 0) {
            throw new Error("No orders found");
        }

        return res.status(200).json({ orders });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "No orders found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while fetching orders : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getAllOrdersFromRestaurant = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const restaurantID = req.query["restaurantID"];

    if (!restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data for order retrieval" });
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

        url = `${RESTAURANT_URL}find`;
        response = await axios.get(url, {
            params: { id: restaurantID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status != 200) {
            throw new Error("Restaurant not found");
        }

        const orders = await orderService.getAllOrdersFromRestaurant(response.data.restaurant._id);

        if (!orders || orders.length === 0) {
            throw new Error("No orders found");
        }

        return res.status(200).json({ orders });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "No orders found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while fetching orders : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const countOrdersByDay = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userType = req.decoded.type;
    const userID = req.decoded.id;

    if (!userType === "RESTAURANT") {
        return res.status(403).json({ error: "Forbidden" });
    }
    
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const orders = req.body["orders"];

    if (!orders) {
        return res.status(400).json({ error: "Missing mandatory data for order counting" });
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

        const ordersByDay = orderService.countOrdersByDay(orders);

        return res.status(200).json({ ordersByDay });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "No orders found for this user") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for order counting") {
            return res.status(400).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting user's orders : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const metrics = async (req, res) => {
    const userType = req.decoded.type;

    try {
        if (userType != "TECHNICAL") {
            throw new Error("Invalid user type");
        }

        const metrics = await orderService.getPerformanceMetrics();

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
    createAndAddOrder,
    getOrder,
    updateOrderStatus,
    getAllFromUser,
    getAllOrders,
    getAllOrdersFromRestaurant,
    countOrdersByDay,
    metrics
};