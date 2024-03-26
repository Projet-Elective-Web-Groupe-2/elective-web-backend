/**
 * Le modèle représentant une commande.
 * @author GAURE Warren
 * @version 1.0 
*/

const orderSchema = require('../schemas/orderSchema');

// Définition du modèle pour une commande.
const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;