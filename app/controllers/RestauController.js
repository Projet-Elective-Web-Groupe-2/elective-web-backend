const Restaurant = require('./restaurantModel');

exports.createRestaurant = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.phoneNumber) {
            throw new Error('Missing required fields');
        }

        const newRestaurant = new Restaurant({
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            image: req.body.image,
            ownerID: req.body.ownerID,
            description: req.body.description,
            status: req.body.status,
            openingHours: req.body.openingHours,
        });

        const savedRestaurant = await newRestaurant.save();

        res.status(201);
    } catch (err) {
        res.sendStatus(400); 
    }
};
