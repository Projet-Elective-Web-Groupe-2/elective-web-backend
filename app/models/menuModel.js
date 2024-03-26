/**
 * Le modèle représentant un menu.
 * @author GAURE Warren
 * @version 1.0
*/

const menuSchema = require('../schemas/menuSchema');

// Définition du modèle pour une livraison.
const menuModel = mongoose.model('Menu', menuSchema);

module.exports = menuModel;