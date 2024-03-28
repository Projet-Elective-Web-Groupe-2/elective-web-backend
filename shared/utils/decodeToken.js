/**
 * Le fichier contenant des méthodes utiles pour l'application.
 * @author GAURE Warren
 * @version 1.0
*/

const jwt = require('jsonwebtoken');

/**
 * Fonction permettant de décoder un JSON Web Token afin récupérer l'ID et le type de l'utilisateur.
 * @param {jwt} token 
 * @returns {object} L'ID et le type de l'utilisateur.
*/
const decodeToken = (token) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
        if (error) {
            console.error("Error while decoding token : " + error.message);
        }
        else {
            const userID = decoded.id;
            const userType = decoded.type;
            return { userID, userType };
        }
    });
};

module.exports = decodeToken;
