const Restaurant = require('../models/restaurantModel');

exports.createRestaurant = async (req, res) => {
    console.log("Received request:", req.body);
    try {
        // Vérification des champs requis
        if (!req.body.name || !req.body.address || !req.body.phoneNumber) {
            console.log("Validation error: Missing required fields");
            throw new Error('Missing required fields');
        }

        console.log("Creating new restaurant with data:", req.body);
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
