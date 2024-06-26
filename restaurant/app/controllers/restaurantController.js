/**
 * Le contrôleur contenant la logique métier associée à chaque route des restaurants.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios')  ;
const restaurantService = require('../services/restaurantService');

const AUTH_URL = `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/`;
const ORDER_URL = `http://${process.env.ORDER_HOST}:${process.env.ORDER_PORT}/order/`;

const createRestaurant = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const name = req.body["name"];
    const address = req.body["address"];
    const ownerID = req.body["ownerID"];
    const image = req.body["image"];

    if (!name || !address || !ownerID || !image) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const existingRestaurant = await restaurantService.findRestaurant(name, ownerID, address);

        if (existingRestaurant) {
            throw new Error("Restaurant already exists");
        }

        await restaurantService.createRestaurant(name, ownerID, address, image);

        return res.status(201).json({ message: "Restaurant created" });
    }
    catch (error) {
        if (error.message === "Restaurant already exists") {
            return res.status(409).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while creating a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const findRestaurant = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const restaurantID = req.query.id;

    if (!restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return res.status(200).json({ restaurant });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while finding a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const findRestaurantByOwnerID = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const ownerID = parseInt(req.query.id);

    if (!ownerID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const restaurant = await restaurantService.findRestaurantByOwnerID(ownerID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return res.status(200).json({ restaurant });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while finding a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const deleteRestaurant = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const restaurantID = req.query.id;

    if (!restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType !== "RESTAURANT" && userType !== "SALES") {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        else if (restaurant.ownerID !== userID && userType != "SALES") {
            throw new Error("Restaurant does not belong to user");
        }

        await restaurantService.deleteRestaurant(restaurantID);

        return res.status(200).json({ message: "Restaurant successfully deleted" });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Restaurant does not belong to user") {
            return res.status(403).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while deleting a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const editRestaurant = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];
    const newAddress = req.body["address"];
    const newName = req.body["name"];

    if (!restaurantID || !newAddress || !newName) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT" && userType != "SALES") {
        return res.status(403).json({ error: "Forbidden" });
    }
    
    try {
        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        else if (restaurant.ownerID !== userID && userType != "SALES") {
            throw new Error("Restaurant does not belong to user");
        }

        const restaurantWithParameter = await restaurantService.findRestaurantByNameOrAddress(newName, newAddress);

        if (restaurantWithParameter && restaurantWithParameter._id != restaurantID) {
            throw new Error("Restaurant with same name or address already exists");
        }
        else if (restaurantWithParameter && restaurantWithParameter._id == restaurantID) {
            throw new Error("Restaurant already has this name and address");
        }

        await restaurantService.editRestaurant(restaurantID, newName, newAddress);

        return res.status(200).json({ message: "Restaurant successfully updated" });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Restaurant does not belong to user") {
            return res.status(403).json({ error: error.message });
        }
        else if (error.message === "Restaurant with same name or address already exists") {
            return res.status(409).json({ error: error.message });
        }
        else if (error.message === "Restaurant already has this name and address") {
            return res.status(409).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while updating a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const getAllRestaurants = async (req, res) => {
    const userType = req.decoded.type;

    if (userType != "CLIENT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        const restaurants = await restaurantService.getAllRestaurants();

        if (restaurants.length === 0) {
            throw new Error("No restaurants found");
        }

        return res.status(200).json({ restaurants });
    }
    catch (error) {
        if (error.message === "No restaurants found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting all restaurants : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const changeStatus = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];

    if (!restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT" || userType != "SALES") {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        else if (restaurant.ownerID !== userID && userType != "SALES") {
            throw new Error("Restaurant does not belong to user");
        }

        await restaurantService.changeStatus(restaurantID);

        return res.status(200).json({ message: "Restaurant status successfully changed" });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Restaurant does not belong to user") {
            return res.status(403).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while changing restaurant status : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const addProduct = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];
    const product = req.body["product"];

    if (!restaurantID || !product) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        await restaurantService.addProduct(restaurantID, product);

        return res.status(201).json({ message: "Product successfully added to restaurant" });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while adding a product to a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const addOrder = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];
    const order = req.body["order"];

    if (!restaurantID || !order) {
        return res.status(400).json({ error: "Missing mandatory data for order adding" });
    }

    const userType = req.decoded.type;

    if (userType != "CLIENT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        await restaurantService.addOrder(restaurantID, order);

        return res.status(201).json({ message: "Order successfully added to restaurant" });
    }
    catch (error) {
        if (error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while adding an order to a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const updateOrder = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];
    const orderID = req.body["orderID"];
    const newStatus = req.body["newStatus"];

    if (!orderID || !newStatus || !restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data for order status update" });
    }

    try {
        await restaurantService.updateOrderStatus(restaurantID, orderID, newStatus);

        return res.status(200).json({ message: "Order status updated" });
    }
    catch (error) {
        if (error.message === "Order not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while updating order status : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const getOrdersSince = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    if (!req.query) {
        return res.status(400).json({ error: "Required query parameters are missing" });
    }

    const restaurantID = req.query.restaurantID;
    const numberOfDaysBack = req.query.daysBack;

    if (!restaurantID || !numberOfDaysBack) {
        return res.status(400).json({ error: "Missing mandatory data" });
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

        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        else if (restaurant.ownerID !== userID) {
            throw new Error("Restaurant does not belong to user");
        }

        const orders = await restaurantService.getOrdersSince(restaurantID, numberOfDaysBack);

        url = `${ORDER_URL}getOrdersCountByDay`;
        response = await axios.post(url, {
            orders: orders 
        },
        {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });

        if (response.status !== 200) {
            throw new Error("Error while trying to get orders count by day");
        }

        const ordersByDay = response.data.ordersByDay;

        return res.status(200).json({ ordersByDay });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else if (error.message === "Restaurant does not belong to user") {
            return res.status(403).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting orders : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const getOrderCount = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "RESTAURANT") {
        return res.status(403).json({ error: "Forbidden" });
    }

    if (!req.query) {
        return res.status(400).json({ error: "Required query parameters are missing" });
    }

    const restaurantID = req.query.restaurantID;

    if (!restaurantID) {
        return res.status(400).json({ error: "Missing mandatory data" });
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

        const restaurant = await restaurantService.findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        
        return res.status(200).json({ orderCount: restaurant.orders.length });
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "Restaurant not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting order count : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const addMenu = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const restaurantID = req.body["restaurantID"];
    const menu = req.body["menu"];

    if (!restaurantID || !menu) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        await restaurantService.addMenu(restaurantID, menu);

        return res.status(201).json({ message: "Menu successfully added to restaurant" });
    }
    catch (error) {
        if (error.message === "Restaurant not found" || error.message === "Menu not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while adding a menu to a restaurant : ", error.message);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const metrics = async (req, res) => {
    const userType = req.decoded.type;

    try {
        if (userType != "TECHNICAL") {
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
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = {
    createRestaurant,
    findRestaurant,
    findRestaurantByOwnerID,
    editRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    changeStatus,
    addProduct,
    addMenu,
    addOrder,
    updateOrder,
    getOrdersSince,
    getOrderCount,
    metrics
};