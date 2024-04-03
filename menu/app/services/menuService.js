const menu = require('../models/menuModel');

const createMenu = async (name, description, price) => {
    try {
        const newMenu = new menu({ 
            name: name,
            description: description,
            price: price 
        });

        await newMenu.save();

        return newMenu;
    }
    catch (error) {
        throw new Error("Error while trying to create a Menu : " + error.message)
    }
}
