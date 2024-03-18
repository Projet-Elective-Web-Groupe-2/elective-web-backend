/**
 * Le module contenant les requêtes liées à l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const User = require('../models/userModel');

/**
 * Fonction permettant de récupérer un utilsateur depuis la base de données grâce à son email.
 * @param {string} email - L'addresse email de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur en question, ou null si rien n'a été trouvé.
*/
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    }
    catch (error) {
        throw error;
    }
};

module.exports = getUserByEmail;