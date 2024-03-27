const Restaurant = require('./restaurantModel');

exports.createRestaurant = async (req, res) => {
    try {
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

        res.status(201).json(savedRestaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
