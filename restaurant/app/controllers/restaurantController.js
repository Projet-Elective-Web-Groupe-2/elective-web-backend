/**
 * Le contrôleur contenant la logique métier associée à chaque route des restaurants.
 * @author AMARA Ahmed
 * @version 1.0
*/

const restaurantService = require('../services/restaurantService');

const Restaurant = require('../models/restaurantModel');

const createRestaurant = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const name = req.body["name"];
    const address = req.body["address"];
    const phoneNumber = req.body["phoneNumber"];

    if (!name || !address || !phoneNumber) {
        return res.status(400).json({ error: "Missing mandatory data for restaurant creation" });
    }

    try {
        // Checker si un restaurant avec ces mêmes paramètres existe déjà
        // Si oui, renvoyer une erreur 409 Conflict
        // Sinon, créer le restaurant
        const newRestaurant = new Restaurant({
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            image: req.body.image || '', 
            ownerID: req.body.ownerID || null,
            description: req.body.description || '', 
            status: req.body.status || false, 
        });

      
        const savedRestaurant = await newRestaurant.save();
        console.log("Restaurant saved:", savedRestaurant);

        res.status(201).send(savedRestaurant);
    } catch (err) {
        console.log("Error in createRestaurant:", err.message);
        res.status(400).send({ error: err.message });
    }
};

module.exports = {
    createRestaurant
};