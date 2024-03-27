const restaurantSchema = require('../schemas/restaurantSchema');


const restaurantModel = mongoose.model('Restaurant', restaurantSchema);

module.exports = restaurantModel;






