const menuModel = require('../models/menuModel');
const menu = require('../models/menuModel');
const axios = require('axios');

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

const createAndAddMenu = async (name, products, image, drink) => {
    try {
        const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

        const description = products.map(product => product.name).join(', ');
        
        const newMenu = new menu({ 
            name: name,
            description: description,
            totalPrice: totalPrice,
            image: image,
           // products: products.map(product => product._id), a confirmer avec le groupe s'il veulent les ids ou les noms des produits
            drink: drink 
        });

        await newMenu.save();

        return newMenu;
    }
    catch (error) {
        throw new Error("Error while trying to create a Menu : " + error.message)
    }
}
/**
 * Fonction permettant de retrouver un menu dans la base de données grâce à son ID.
 * @param {String} id - L'ID du menu.
 * @returns {object} Le menu trouvé.
*/
const findMenuByID = async (id) => {
    try {
        const menu = await menuModel.findById(id).select('-products');

        return menu;
    }
    catch(error) {
        throw new Error("Error while trying to find a menu by ID : " + error.message);
    }
};
const updateMenu = async (menuID, productIds, token) => { 
    try {
        const productResponse = await axios.get(`http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product/getProducts`, {
            data: { productIds }, 
            headers: { Authorization: `Bearer ${token}` }
        });

        if (productResponse.status !== 200) {
            throw new Error("Product not found");
        }

        const products = productResponse.data.productsInfo;

        const menu = await menuModel.findById(menuID);

        if (!menu) {
            throw new Error("Menu not found");
        }

        menu.products.push(...products);

        await menu.save();

        return menu; 
    } catch (error) {
        throw new Error("Error while adding product to menu: " + error.message);
    }
}
module.exports = {
    createAndAddMenu,
    getPerformanceMetrics,
    findMenuByID,
    updateMenu,
};
