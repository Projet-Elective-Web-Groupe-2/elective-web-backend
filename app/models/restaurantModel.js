/**
 * Le modèle représentant un restaurant.
 * @author GAURE Warren
 * @version 1.0
*/

const restaurantSchema = require('../schemas/restaurantSchema');

const restaurantModel = mongoose.model('Restaurant', restaurantSchema);

module.exports = restaurantModel;