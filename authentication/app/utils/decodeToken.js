/**
 * Le fichier contenant la méthode pour décoder un token.
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
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = decodeToken;