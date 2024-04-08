/**
 * Le fichier contenant les traitements liés aux menus.
 * @author AMARA Ahmed
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
const Menu = require('../models/menuModel');

/**
 * Fonction permettant de créer et ajouter un menu à un restaurant
 * @param {String} name - Le nom du menu
 * @param {Array} products - Les produits du menu.
 * @param {String} image - L'image du menu, contenue sous forme d'URL.
 * @param {Boolean} drink - Un booléen indiquant si le menu possède une boisson ou non.
 * @returns {object} Le menu créé.
*/
const createAndAddMenu = async (name, products, image, drink) => {
    try {
        const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

        const description = products.map(product => product.name).join(', ');
        
        const newMenu = new Menu({ 
            name: name,
            description: description,
            totalPrice: totalPrice,
            image: image,
            //products: products.map(product => product._id),
            //À confirmer avec le groupe s'ils veulent les ID ou les noms des produits
            drink: drink 
        });

        await newMenu.save();

        return newMenu;
    }
    catch (error) {
        throw new Error("Error while trying to create a menu : " + error.message)
    }
};

/**
 * Fonction permettant de retrouver un menu dans la base de données grâce à son ID.
 * @param {String} id - L'ID du menu.
 * @returns {object} Le menu trouvé.
*/
const findMenuByID = async (id) => {
    try {
        const menu = await Menu.findById(id).select('-products');

        await Menu.populate(menu, { path: 'products', model: 'Product' });

        return menu;
    }
    catch(error) {
        throw new Error("Error while trying to find a menu by ID : " + error.message);
    }
};

/**
 * Fonction permettant de mettre à jour un menu en ajoutant des produits.
 * @param {String} menuID - L'ID du menu à mettre à jour.
 * @param {Array} products - Les produits à ajouter au menu.
 * @returns {object} Le menu mis à jour.
*/
const updateMenu = async (menuID, products) => { 
    try {
        const menu = await Menu.findById(menuID);

        if (!menu) {
            throw new Error("Menu not found");
        }

        menu.products.push(...products);

        await menu.save();

        return menu; 
    }
    catch (error) {
        throw new Error("Error while adding product to menu: " + error.message);
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
    createAndAddMenu,
    findMenuByID,
    updateMenu,
    getPerformanceMetrics
};
