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
 * @param {String} items - Le(s) item(s) commandé(s) (menu(s) et/ou article(s)).
 * @param {String} userID - L'ID du client passant la commande.
 * @param {String} userAddress - L'adresse de l'utilisateur passant la commande.
 * @param {Number} totalPrice - Le prix total de la commande.
 * @returns {object} La commande créée.
 */
const createOrder = async (items, userID, userAddress, totalPrice) => {

    try {
        const newOrder = new Order({
            clientID: userID,
            address: userAddress,
            status: "Created",
            totalPrice: totalPrice,
        });

        for (let item of items) {
            if (item.isMenu) {
                newOrder.menus.push(item.idProduit);
            }
            else {
                newOrder.products.push(item.idProduit);
            }
        }

        await newOrder.save();

        await Order.populate(newOrder, { path: 'menus', model: 'Menu' });
        await Order.populate(newOrder, { path: 'products', model: 'Product' });

        return newOrder;
    }
    catch (error) {
        throw new Error("Error while trying to create an order : " + error.message);
    }
};

/**
 * Fonction permettant de retrouver une commande dans la base de données grâce à son ID.
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
 * Fonction permettant de mettre à jour le statut d'une commande.
 * @param {String} id - L'ID de la commande.
 * @param {String} newStatus - Le nouveau statut de la commande.
 * @returns {object} La commande mise à jour.
*/ 
const updateOrderStatus = async (id, newStatus) => {
    try {
        const order = await findOrderByID(id);

        order.status = newStatus;

        await order.save();

        return order;
    }
    catch (error) {
        throw new Error("Error while trying to update an order status : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer toutes les commandes d'un utilisateur.
 * @param {String} userID - L'ID de l'utilisateur.
 * @returns {Array} Les commandes de l'utilisateur.
 */
const getAllOrdersFromUser = async (userID) => {
    try {
        const orders = await Order.find({ clientID: userID });

        if (!orders || orders.length === 0) {
            throw new Error("No orders found for this user.");
        }

        for (let order of orders) {
            await Order.populate(order, { path: 'menus', model: 'Menu' });
            await Order.populate(order, { path: 'products', model: 'Product' });
        }
        
        return orders;
    }
    catch (error) {
        throw new Error("Error while trying to get all orders from a user : " + error.message);
    }
};

/**
 * Fonction permettant de compter le nombre de commandes par jour avec un tableau de commandes.
 * @param {Array} orders - Les commandes à traiter.
 * @returns {Array} Le nombre de commandes par jour.
 */
const countOrdersByDay = (orders) => {
    const ordersByDay = {};

    for (let order of orders) {
        const date = order.date.split('T')[0];

        if (!ordersByDay[date]) {
            ordersByDay[date] = 0;
        }

        ordersByDay[date]++;
    }

    return ordersByDay;
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
    findOrderByID,
    updateOrderStatus,
    getAllOrdersFromUser,
    countOrdersByDay,
    getPerformanceMetrics
};