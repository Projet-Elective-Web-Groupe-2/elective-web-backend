/**
 * Le contrôleur contenant la logique métier associée à chaque route de livraison.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios');
const deliveryService = require('../services/deliveryService');
const decodedToken = require('../utils/decodedToken');

const AUTH_URL = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/`;
const ORDER_URL = `http://${process.env.ORDER_HOST}:${process.env.ORDER_PORT}/order/`;

const acceptDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodedToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'LIVREUR') {
        return res.status(403).json({ error: "Forbidden" });
    }

    const orderID = req.body["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for accepting delivery" });
    }

    let url;
    let response;

    try {
        url = `${AUTH_URL}find`;
        response = await axios.get(url, {
            params: { id: userID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        const order = await deliveryService.findOrderByID(orderID);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (order.status !== "In preparation") {
            return res.status(400).json({ error: "Order is not pending" });
        }

        await deliveryService.acceptDelivery(orderID, userID);

        return res.status(200).json({ message: "Delivery accepted" });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (error.message === "Order is not pending") {
            return res.status(400).json({ error: "Order is not pending" });
        }
        else {
            return res.status(500).json({ error: "Internal server error" });
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

        const metrics = await orderService.getPerformanceMetrics();

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
    acceptDelivery,
    metrics
}