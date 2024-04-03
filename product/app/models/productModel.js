/**
 * Le modèle représentant un produit (article).
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');
const productSchema = require('../schemas/productSchema');

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;