const menu = require('../models/menuModel');

const createAndAddMenu = async (name, products) => {
    try {
        const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

        const description = products.map(product => product.name).join(', ');

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

module.exports = {
    createAndAddMenu,
};
