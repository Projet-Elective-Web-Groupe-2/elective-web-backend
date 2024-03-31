const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');

async function addProductToRestaurant({ restaurantId, productData }) {
    try {
        // Création du produit
        const newProduct = await Product.create(productData);

        // Ajout de la référence du produit dans le tableau de produits du restaurant
        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { products: newProduct._id } },
            { new: true, useFindAndModify: false }
        );

        return newProduct;
    } catch (error) {
        // Gestion des erreurs éventuelles
        throw error;
    }
}

module.exports = {
    addProductToRestaurant,
};
