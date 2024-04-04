/**
 * Le fichier contenant les traitements associés aux commandes.
 * @author GAURE Warren
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
const Order = require('../models/orderModel');

/**
 * Fonction permettant de créer une commande.
 * @param {String} item - L'item à commander (menu ou article).
 * @param {*} isMenu - Un booléen indiquant si l'item est un menu ou non.
 * @param {*} userID - L'ID du client passant la commande.
 * @param {*} userAddress - L'adresse de l'utilisateur passant la commande.
 * @returns {object} La commande créée.
 */
const createOrder = async (item, isMenu, userID, userAddress) => {

    try {
        const newOrder = new Order({
            clientID: userID,
            address: userAddress,
            status: "Créée",
            totalPrice: isMenu ? item.totalPrice : item.price,
        });

        if (isMenu) {
            newOrder.menus.push(item._id);
        }
        else {
            newOrder.products.push(item._id);
        }

        await newOrder.save();
        console.log("Order created : " + newOrder._id + " for user " + userID + " at address " + userAddress + " for a total of " + newOrder.totalPrice + "€.");
        console.log("Item ordered : " + (isMenu ? "Menu " + item.name : "Product " + item.name + " qui coûte " + item.price + "€."));
        return newOrder;
    }
    catch (error) {
        throw new Error("Error while trying to create an order : " + error.message);
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
    createOrder,
    getPerformanceMetrics
};