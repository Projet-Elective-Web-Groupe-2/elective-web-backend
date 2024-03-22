/**
 * Le modèle représentant un produit (article).
 * @author GAURE Warren
 * @version 1.0
*/

const productSchema = require('../schemas/productSchema');

// Définition du modèle pour un produit (article).
const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;