/**
 * Le ficher contenant les traitements liés aux restaurants.
 * @author AMARA Ahmed
 * @version 1.0 
*/

const os = require('os');
const osUtils = require('os-utils');
const Restaurant = require('../models/restaurantModel');
const Product = require('../models/productModel'); 


/**
 * Fonction permettant de récupérer un utilisateur depuis la base de données grâce à certaines informations.
 * La méthode va faire la recherche sur trois champs : ownerID, address et name.
 * @param {string} name - Le nom du restaurant.
 * @param {Number} ownerID - L'ID du propriétaire du restaurant (un utilisateur de type "RESTAURATEUR").
 * @param {string} address - L'addresse du restaurant.
 * @returns 
 */
const findRestaurant = async (name, ownerID, address) => {
    try {
        const restaurant = await Restaurant.findOne({
            $or: [
                { name },
                { ownerID },
                { address }
            ]
        });
        return restaurant;
    }
    catch (error) {
        throw new Error("Error while trying to find a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant de retrouver un restaurant dans la base de données grâce à son ID.
 * @param {String} id - L'ID du restaurant.
 * @returns {object} Le restaurant trouvé.
*/
const findRestaurantByID = async (id) => {
    try {
        const restaurant = await Restaurant.findById(id);

        return restaurant;
    }
    catch(error) {
        throw new Error("Error while trying to find a restaurant by ID : " + error.message);
    }
};

/**
 * Fonction permettant de créer un restaurant dans la base de données.
 * @param {string} name - Le nom du restaurant.
 * @param {Number} ownerID - L'ID du propriétaire du restaurant (un utilisateur de type "RESTAURATEUR").
 * @param {string} address - L'addresse du restaurant.
 * @returns {object} Le restaurant créé.
*/


const createRestaurant = async (name, ownerID, address) => {
    try {
        const product1 = new Product({
            name: "Coca",
            description: "Coca cola 33cl",
            price: 10
        });
        const product2 = new Product({                         
            name: "Frites",
            description: "frites avec 3 sauces au choix",
            price: 7
        });

        await product1.save(); 
        await product2.save(); 

        const products = [product1.toObject(), product2.toObject()]; 

        const newRestaurant = new Restaurant({
            name: name,
            ownerID: ownerID,
            address: address,
            products: products 
        });

        await newRestaurant.save();

        return newRestaurant;

    } catch (error) {
        throw new Error("Error while trying to create a restaurant : " + error.message);
    }
};

/**
 * Fonction permettant d'ajouter un produit à un restaurant.
 * @param {object} restaurantID - L'ID du restaurant auquel on veut ajouter un produit.
 * @param {object} product - Le produit à ajouter.
 */
const addProduct = async (restaurantID, product) => {
    try {
        Restaurant.findByIdAndUpdate(restaurantID, {
            $addToSet: { products: product }
        });
    }
    catch (error) {
        throw new Error("Error while trying to add a product to a restaurant : " + error.message);
    }
};


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
    createRestaurant,
    addProduct,
    addMenu,
    getPerformanceMetrics
};