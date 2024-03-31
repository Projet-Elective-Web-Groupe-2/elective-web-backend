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
    const ownerID = req.body["ownerId"];

    if (!name || !address || !ownerID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const existingRestaurant = await restaurantService.findRestaurant(null, address, name);

        if (existingRestaurant) {
            throw new Error("Restaurant already exists");
        }

        restaurantService.createRestaurant(name, ownerID, address);

        console.log("Restaurant saved:", savedRestaurant);

        return res.status(200);
    }
    catch (error) {
        if (error.message === "Restaurant already exists") {
            return res.status(409).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while creating a restaurant :", error.message);
            return res.status(400).send({ error: error.message });
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
    metrics
};