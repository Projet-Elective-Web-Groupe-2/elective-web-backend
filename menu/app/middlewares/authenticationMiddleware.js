/**
 * Middleware de gestion de l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const jwt = require('jsonwebtoken');

/**
 * Fonction pour gérer l'authentification de l'utilisateur grâce au token.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @param {Function} next Le prochain middleware.
*/
function verifyToken(req, res, next) {
    // Exclusion de certaines routes
    const authorizedRoutes = [
        '/docs',
        '/healthcheck',
        '/metrics',
        '/favicon.ico',
        '/menu'
    ];

    if (authorizedRoutes.some(route => route === req.path)) {
        return next();
    }

    if (!req.headers.authorization) {
        return res.status(401).send({ message: "Missing token" });
    }

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Authentication failed" });
        }
        req.decoded = decoded;
        next();
    });
}

module.exports = verifyToken;