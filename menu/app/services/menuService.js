const menuModel = require('../models/menuModel');
const menu = require('../models/menuModel');

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

const createAndAddMenu = async (name, products) => {
    try {
        const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

        const description = products.map(product => product.name).join(', ');
        console.log("description", + description);
        const newMenu = new menu({ 
            name: name,
            description: description,
            totalPrice: totalPrice
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
        const menu = await menuModel.findById(id);

        return menu;
    }
    catch(error) {
        throw new Error("Error while trying to find a menu by ID : " + error.message);
    }
};

module.exports = {
    createAndAddMenu,
    getPerformanceMetrics,
    findMenuByID,
};
