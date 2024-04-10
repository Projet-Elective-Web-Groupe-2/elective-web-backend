/**
 * Le ficher contenant les traitements liés aux restaurants.
 * @author AMARA Ahmed
 * @version 1.0 
*/

const os = require('os');
const osUtils = require('os-utils');
const Restaurant = require('../models/restaurantModel');

/**
 * Fonction permettant de récupérer un restaurant depuis la base de données grâce à certaines informations.
 * La méthode va faire la recherche sur trois champs : ownerID, address et name.
 * @param {string} name - Le nom du restaurant.
 * @param {Number} ownerID - L'ID du propriétaire du restaurant (un utilisateur de type "RESTAURANT").
 * @param {string} address - L'addresse du restaurant.
 * @returns {object} Le restaurant trouvé avec ces informations
 */
const findRestaurant = async (name, ownerID, address) => {
    try {
        const restaurant = await Restaurant.findOne({
            $or: [
            { name: name },
            { ownerID: ownerID },
            { address: address }
            ]
        });
        return restaurant;
    }
    catch (error) {
        throw new Error("Error while trying to find a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant de retrouver un restaurant dans la base de données grâce à un ID.
 * @param {String} id - L'ID du restaurant ou de son propriétaire.
 * @returns {object} Le restaurant trouvé.
*/
const findRestaurantByID = async (id) => {
    try {
        const restaurant = await Restaurant.findOne({
            $or: [
            { _id: id },
            { ownerID: id }
            ]
        });

        await Restaurant.populate(restaurant, { path: 'products', model: 'Product' });
        await Restaurant.populate(restaurant, { path: 'orders', model: 'Order' });
        await Restaurant.populate(restaurant, { path: 'menus', model: 'Menu' });

        return restaurant;
    }
    catch(error) {
        throw new Error("Error while trying to find a restaurant by ID : " + error.message);
    }
};

/**
 * Fonction permettant de retrouver un restaurant dans la base de données grâce à son nom ou son adresse. 
 * @param {String} name - Le nom du restaurant.
 * @param {String} address - L'adresse du restaurant.
 * @returns {object} Le restaurant trouvé.
 */
const findRestaurantByNameOrAddress = async (name, address) => {
    try {
        const restaurant = await Restaurant.findOne({
            $or: [
                { name: name },
                { address: address }
            ]
        });

        return restaurant;
    }
    catch (error) {
        throw new Error("Error while trying to find a restaurant by name or address : " + error.message);
    }
};

/**
 * Fonction permettant de créer un restaurant dans la base de données.
 * @param {string} name - Le nom du restaurant.
 * @param {Number} ownerID - L'ID du propriétaire du restaurant (un utilisateur de type "RESTAURANT").
 * @param {string} address - L'addresse du restaurant.
 * @param {string} image - L'URL de l'image du restaurant.
 * @returns {object} Le restaurant créé.
*/
const createRestaurant = async (name, ownerID, address, image) => {
    try {
        const newRestaurant = new Restaurant({
            name: name,
            ownerID: ownerID,
            address: address,
            image: image
        });

        await newRestaurant.save();
        
        // For testing purposes
        console.log("Restaurant created : ", newRestaurant._id);

        return newRestaurant;
    }
    catch (error) {
        throw new Error("Error while trying to create a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant de modifier les informations d'un restaurant dans la base de données.
 * @param {String} restaurantID - L'ID du restaurant à modifier.
 * @param {String} name - Le nouveau nom du restaurant.
 * @param {String} address - La nouvelle adresse du restaurant.
 */
const editRestaurant = async (restaurantID, name, address) => {
    try {
        const restaurant = await findRestaurantByID(restaurantID);

        restaurant.name = name;
        restaurant.address = address;

        await restaurant.save();
    }
    catch (error) {
        throw new Error("Error while trying to edit a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant de supprimer un restaurant de la base de données.
 * @param {String} restaurantID - L'ID du restaurant à supprimer.
 */
const deleteRestaurant = async (restaurantID) => {
    try {
        await Restaurant.deleteOne({ _id: restaurantID });
    }
    catch (error) {
        throw new Error("Error while trying to delete a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer tous les restaurants de la base de données.
 * @returns {Array} Les restaurants trouvés.
*/
const getAllRestaurants = async () => {
    try {
        const restaurants = await Restaurant.find();

        if (restaurants.length === 0) {
            return [];
        }

        return restaurants;
    }
    catch (error) {
        throw new Error("Error while trying to get all restaurants : " + error.message);
    }
};

/**
 * Fonction permettant d'ajouter un produit à un restaurant.
 * @param {object} restaurantID - L'ID du restaurant auquel on veut ajouter un produit.
 * @param {object} product - Le produit à ajouter.
*/
const addProduct = async (restaurantID, product) => {
    try {
        const restaurant = await findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        restaurant.products.push(product._id);

        await restaurant.save();
    }
    catch (error) {
        throw new Error("Error while trying to add a product to a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant d'ajouter une commande à un restaurant.
 * @param {object} restaurantID - L'ID du restaurant auquel on veut ajouter une commande.
 * @param {object} order - La commande à ajouter.
*/
const addOrder = async (restaurantID, order) => {
    try {
        const restaurant = await findRestaurantByID(restaurantID);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        restaurant.orders.push(order._id);

        await restaurant.save();
    }
    catch (error) {
        throw new Error("Error while trying to add an order to a restaurant : " + error.message);
    }
}

/**
 * Fonction permettant de mettre à jour le statut d'une commande.
 * @param {String} restaurantID - L'ID du restaurant.
 * @param {String} orderID - L'ID de la commande.
 * @param {String} newStatus - Le nouveau statut de la commande.
*/
const updateOrderStatus = async (restaurantID, orderID, newStatus) => {
    try {
        const restaurant = await Restaurant.findById(restaurantID);
        
        const index = restaurant.orders.findIndex((o) => o._id.toString() === orderID.toString());
        
        restaurant.orders[index].status = newStatus;
        
        await restaurant.save();
    }
    catch (error) {
        throw new Error("Error while trying to update an order status : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer les commandes passées depuis un certain nombre de jours.
 * @param {String} restaurantID - L'ID du restaurant.
 * @param {Number} numberOfDaysBack - Le nombre de jours en arrière à partir duquel on veut récupérer les commandes.
 * @returns {Array} Les commandes passées depuis un certain nombre de jours.
 */
const getOrdersSince = async (restaurantID, numberOfDaysBack) => {
    try {
        const restaurant = await findRestaurantByID(restaurantID);

        await Restaurant.populate(restaurant, { path: 'orders', model: 'Order' });

        if (restaurant.orders.length === 0) {
            return [];
        }
        else if (numberOfDaysBack === 0) {
            return restaurant.orders;
        }
        else {
            const currentDate = new Date();
            
            const startDate = new Date(currentDate.getTime() - numberOfDaysBack * 24 * 60 * 60 * 1000);
            
            const orders = restaurant.orders.filter((order) => new Date(order.date).getTime() >= startDate.getTime());
            
            return orders;
        }
    }
    catch (error) {
        throw new Error("Error while trying to get orders since a certain number of days : " + error.message);
    }
};

/**
 * Fonction permettant de calculer le revenu total d'un restaurant à partir d'un tableau de commandes.
 * @param {Array} orders - Les commandes pour lesquelles on veut calculer le revenu total.
 * @returns {Number} Le revenu total.
 */
const getTotalRevenue = async (orders) => {
    let totalRevenue = 0;

    for (let order of orders) {
        totalRevenue += order.totalPrice;
    }

    return totalRevenue;
};

/**
 * Fonction permettant d'ajouter un menu au restaurant.
 * @param {String} restaurantID - L'ID du restaurant.
 * @param {object} menu - Le menu à ajouter.
*/
const addMenu = async (restaurantID, menu) => {
    try {
        Restaurant.findByIdAndUpdate(restaurantID, {
            $addToSet: { menu: menu }
        });
    }
    catch (error) {
        throw new Error("Error while trying to add a product to a restaurant : " + error.message);
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
    findRestaurant,
    findRestaurantByID,
    findRestaurantByNameOrAddress,
    createRestaurant,
    editRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    addProduct,
    addMenu,
    addOrder,
    updateOrderStatus,
    getOrdersSince,
    getTotalRevenue,
    getPerformanceMetrics
};