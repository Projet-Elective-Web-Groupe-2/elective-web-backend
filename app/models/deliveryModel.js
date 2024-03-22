/**
 * Le modèle représentant une livraison.
 * @author GAURE Warren
 * @version 1.0
*/

const deliverySchema = require('../schemas/deliverySchema');

// Définition du modèle pour une livraison.
const deliveryModel = mongoose.model('Delivery', deliverySchema);

module.exports = deliveryModel;