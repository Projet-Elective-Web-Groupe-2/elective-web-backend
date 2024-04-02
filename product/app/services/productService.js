const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel');
const os = require('os');
const osUtils = require('os-utils');

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

async function addProductToRestaurant(restaurantId, name, description, price) {
    try {
        const newProduct = await Product.create({ name, description, price });

        await Restaurant.findByIdAndUpdate(restaurantId, { $push: { products: newProduct._id } }, { new: true, useFindAndModify: false });
        return { error: false, product: newProduct };
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    getPerformanceMetrics,
    getCpuUsage,
    addProductToRestaurant,

};
