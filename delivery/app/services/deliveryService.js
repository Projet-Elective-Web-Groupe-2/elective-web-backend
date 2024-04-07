/**
 * Le fichier contenant les traitements associés aux livraisons.
 * @author GAURE Warren
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
const Order = require('../models/orderModel');

/**
 * Fonction permettant de retrouver une livraison dans la base de données grâce à son ID.
 * @param {String} id - L'ID de la commande.
 * @returns {object} La commande trouvée.
*/
const findOrderByID = async (id) => {
    try {
        const order = await Order.findById(id);

        return order;
    }
    catch(error) {
        throw new Error("Error while trying to find an order by ID : " + error.message);
    }
};

/**
 * Fonction permettant d'accepter une livraison.
 * @param {String} orderID - L'ID de la commande.
 * @param {Number} delivererID - L'ID du livreur.
*/
const acceptDelivery = async (orderID, delivererID) => {
    try {
        const order = await findOrderByID(orderID);

        order.status = "Being delivered";
        order.delivererID = delivererID;

        await order.save();
    }
    catch(error) {
        throw new Error("Error while trying to accept a delivery : " + error.message);
    }
};

/**
 * Fonction permettant de refuser une livraison.
 * @param {String} orderID - L'ID de la commande.
 * @param {Number} delivererID - L'ID du livreur.
 */
const refuseDelivery = async (orderID, delivererID) => {
    try {
        const order = await findOrderByID(orderID);

        order.refusedBy.push(delivererID);
        
        await order.save();
    }
    catch(error) {
        throw new Error("Error while trying to refuse a delivery : " + error.message);
    }
};


/**
 * Fonction permettant de retrouver toutes les commandes avec un filtre précis.
 * Il faut que la commande soit en cours de préparation et n'ait pas été refusée par le livreur en amont de la requête.
 * @param {Number} userID - L'ID de l'utilisateur.
 * @returns {Array} Un tableau contenant les commandes trouvées.
 */
const getAllWithFilter = async (userID) => {
    try {
        const orders = await Order.find({ status: "In preparation", refusedBy: { $nin: [userID] } });

        if (!orders || orders.length === 0) {
            throw new Error("No orders found for this deliverer.");
        }

        for (let order of orders) {
            await Order.populate(order, { path: 'menus', model: 'Menu' });
            await Order.populate(order, { path: 'products', model: 'Product' });
        }

        return orders;
    }
    catch(error) {
        throw new Error("Error while trying to find orders with filter : " + error.message);
    }
};

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

module.exports = {
    findOrderByID,
    acceptDelivery,
    refuseDelivery,
    getAllWithFilter,
    getPerformanceMetrics
};