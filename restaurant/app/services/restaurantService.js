const Restaurant = require('../models/restaurantModel');

const createRestaurant = async (restaurantData) => {
    try {
        const newRestaurant = new Restaurant(restaurantData);
        const savedRestaurant = await newRestaurant.save();
        return savedRestaurant;
    } catch (err) {

        throw err;
    }
};
module.exports = {
    createRestaurant,
  
};