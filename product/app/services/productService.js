/**
 * Le fichier contenant les traitements liés aux articles.
 * @author AMARA Ahmed
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
const Product = require('../models/productModel');

/**
 * Fonction permettant de créer un article et de l'ajouter à un restaurant.
 * @param {String} name - Le nom de l'article.
 * @param {String} description - La description de l'article.
 * @param {Number} price - Le prix de l'article.
 * @returns {object} L'article créé.
 */
const createProduct = async (name, description, price) => {
    try {
        const newProduct = new Product({ 
            name: name,
            description: description,
            price: price 
        });

        await newProduct.save();

        return newProduct;
    }
    catch (error) {
        throw new Error("Error while trying to create a product : " + error.message)
    }
}

/**
 * Fonction permettant de récupérer les métriques de performance de l'application, à savoir :
 * - CPU usage (usage du CPU)
 * - Total memory (mémoire totale)
 * - Free memory (mémoire inutilisée)
 * - Used memory (mémoire utilisée)
 * - Elapsed time (temps de réponse)
 * @returns {object} Un objet contenant les métriques de performance de l'application.
*/
const getPerformanceMetrics = async () => {
    const startTime = Date.now();

    const cpuUsage = await getCpuUsage();
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    return {
        cpuUsage: `${cpuUsage}%`,
        totalMemory: `${(totalMemory / (1024 * 1024)).toFixed(2)} Mo`,
        freeMemory: `${(freeMemory / (1024 * 1024)).toFixed(2)} Mo`,
        usedMemory: `${(usedMemory / (1024 * 1024)).toFixed(2)} Mo`,
        elapsedTime: `${elapsedTime} ms`
    }
};

/**
 * Fonction permettant de retourner le taux d'utilisation du CPU.
 * @returns Le taux d'utilisation du CPU.
*/
function getCpuUsage() {
    return new Promise((resolve) => {
        osUtils.cpuUsage((usage) => {
            resolve((usage * 100).toFixed(2));
        });
    });
};
// recuperer les infos des produits
const getProductsByIds = async (productIds) => {
    try {
        const products = await Product.find({ _id: { $in: productIds } });

        const productsInfo = products.map(product => ({
            name: product.name,
            price: product.price
        }));

        return productsInfo;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des produits : " + error.message);
    }
};

module.exports = {
    createProduct,
    getPerformanceMetrics,
    getProductsByIds
};
