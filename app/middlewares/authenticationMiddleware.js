/**
 * Middleware de gestion de l'authentification.
 * @author GAURE Warren
 * @version 1.1
*/

const jwt = require('jsonwebtoken');

/**
 * Fonction pour gérer l'authentification de l'utilisateur grâce au token.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @param {Function} next Le prochain middleware.
*/
function verifyToken(req, res, next) {
    // Exclusion des routes de login et d'inscription
    if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
        next();
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Missing token" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Authentication failed" });
        }
        req.decoded = decoded;
        next();
    });
}

module.exports = verifyToken;