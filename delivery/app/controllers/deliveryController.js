/**
 * Le contrôleur contenant la logique métier associée à chaque route de livraison.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios');
const deliveryService = require('../services/deliveryService');
const decodeToken = require('../utils/decodeToken');

const AUTH_URL = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/`;

const acceptDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
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
            throw new Error("Order not found" );
        }
        else if (order.status !== "In preparation") {
            throw new Error("Order is not pending");
        }
        else if (order.refusedBy.includes(userID)) {
            throw new Error("Delivery refused by this user");
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
        else if (error.message === "Delivery refused by this user") {
            return res.status(400).json({ error: "Delivery refused by this user" });
        }
        else {
            console.error("Unexpected error while accepting delivery : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const refuseDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
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

        await deliveryService.refuseDelivery(orderID, userID);

        return res.status(200).json({ message: "Delivery refused" });
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
            console.error("Unexpected error while refusing delivery : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getAllWithFilter = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'LIVREUR') {
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

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        const orders = await deliveryService.getAllWithFilter(userID);

        return res.status(200).json({ orders });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else {
            console.error("Unexpected error while getting orders with filter : ", error);
            return res.status(500).json({ error: error.message });
        }
    }
};

const getStatut = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'CLIENT') {
        return res.status(403).json({ error: "Forbidden" });
    }

    const orderID = req.query["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for tracking delivery status" });
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
            throw new Error("Order not found" );
        }
        else if (order.clientID !== userID) {
            throw new Error("Order does not belong to this user");
        }

        return res.status(200).json({ status: order.status });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (error.message === "Order does not belong to this user") {
            return res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting delivery status : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};


const trackDelivery = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const orderID = req.query["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for tracking delivery" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'LIVREUR') {
        return res.status(403).json({ error: "User is not a deliverer" });
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

        const user = response.data.user;

        const order = await deliveryService.findOrderByID(orderID);

        if (!order) {
            throw new Error("Order not found");
        }
        else if (order.delivererID !== userID) {
            throw new Error("Delivery does not belong to this user");
        }
        else if (order.status !== "Being delivered") {
            throw new Error("Order is not being delivered");
        }

        return res.status(200).json({ 
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address
        });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (error.message === "Delivery does not belong to this user") {
            return res.status(403).json({ error: "Delivery does not belong to this user" });
        }
        else if (error.message === "Order is not being delivered") {
            return res.status(400).json({ error: "Order is not being delivered" });
        }
        else {
            console.error("Unexpected error while tracking delivery : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const nearbyDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const orderID = req.body["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for tracking delivery" });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'LIVREUR') {
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

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        const order = await deliveryService.findOrderByID(orderID);

        if (!order) {
            throw new Error("Order not found");
        }
        else if (order.delivererID !== userID) {
            throw new Error("Delivery does not belong to this user");
        }
        else if (order.status !== "Being delivered") {
            throw new Error("Order is not being delivered");
        }

        await deliveryService.nearbyDelivery(orderID);

        return res.status(200).json({ message: "Delivery is nearby" });
    }
    catch(error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (error.message === "Delivery does not belong to this user") {
            return res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Order is not being delivered") {
            return res.status(400).json({ error: "Order is not being delivered" });
        }
        else {
            console.error("Unexpected error while tracking delivery : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const validateDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const orderID = req.body["orderID"];

    if (!orderID) {
        return res.status(400).json({ error: "Missing mandatory data for tracking delivery" });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(token);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    if (userType !== 'LIVREUR') {
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

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        const order = await deliveryService.findOrderByID(orderID);

        if (!order) {
            throw new Error("Order not found");
        }
        else if (order.delivererID !== userID) {
            throw new Error("Delivery does not belong to this user");
        }
        else if (order.status !== "Being delivered" && order.status !== "Delivery near client") {
            throw new Error("Order is not being delivered or nearby");
        }

        await deliveryService.validateDelivery(orderID);

        return res.status(200).json({ message: "Delivery has been validated" });
    }
    catch(error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Order not found") {
            return res.status(404).json({ error: "Order not found" });
        }
        else if (error.message === "Delivery does not belong to this user") {
            return res.status(403).json({ error: "Delivery does not belong to this user"});
        }
        else if (error.message === "Order is not being delivered or nearby") {
            return res.status(400).json({ error: "Order is not being delivered or nearby" });
        }
        else {
            console.error("Unexpected error while validating delivery : ", error);
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
    refuseDelivery,
    getAllWithFilter,
    getStatut,
    trackDelivery,
    nearbyDelivery,
    validateDelivery,
    metrics
}