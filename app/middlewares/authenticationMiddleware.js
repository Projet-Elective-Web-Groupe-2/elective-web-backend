/**
 * Middleware de gestion de l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const jwt = require('jsonwebtoken');

/**
 * Fonction pour gérer l'authentification de l'utilisateur grâce au token.
 * @param {Object} req La requête HTTP
 * @param {Object} res La réponse HTTP
 * @param {Function} next Le prochain middleware
*/
function verifyToken(req, res, next) {
    // On récupère le token depuis les headers de la requête
    const token = req.headers.authorization.split(' ')[1];
    // Si le token n'est pas renseigné, on renvoie une erreur
    if (!token) {
        return res.status(401).send({ message: 'Token absent' });
    }
    // Sinon, on le vérifie
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: "Échec de l'authentification" });
        }
        req.decoded = decoded;
        next();
    });
}

module.exports = verifyToken;