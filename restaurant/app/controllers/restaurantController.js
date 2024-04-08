/**
 * Le contrôleur contenant la logique métier associée à chaque route des restaurants.
 * @author AMARA Ahmed
 * @version 1.0
*/

const restaurantService = require('../services/restaurantService');
const decodeJWT = require('../utils/decodeToken');

const createRestaurant = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const name = req.body["name"];
    const address = req.body["address"];
    const ownerID = req.body["ownerID"];

    if (!name || !address || !ownerID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const existingRestaurant = await restaurantService.findRestaurant(name, ownerID, address);

        if (existingRestaurant) {
            throw new Error("Restaurant already exists");
        }

        await restaurantService.createRestaurant(name, ownerID, address);

        // Fetch the newly created restaurant
        const createdRestaurant = await restaurantService.findRestaurant(name, ownerID, address);
        console.log("Newly created restaurant ID:", createdRestaurant._id);

        return res.status(201).json({ message: "Restaurant created", restaurant: createdRestaurant });

    }
    catch (error) {
        if (error.message === "Restaurant already exists") {
            return res.status(409).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while creating a restaurant : ", error.message);
            return res.status(400).send({ error: error.message });
        }
    }
};


const findRestaurant = async (req, res) => {
    if (!req.params) {
        return res.status(400).json({ error: "Required request parameters is missing" });
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
            return res.status(500).send({ error: error.message });
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
        if (error.message === "Restaurant not found" || error.message === "Product not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while adding a product to a restaurant : ", error.message);
            return res.status(500).send({ error: error.message });
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
            return res.status(500).send({ error: error.message });
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
    createRestaurant,
    findRestaurant,
    addProduct,
    addMenu,
    metrics
};