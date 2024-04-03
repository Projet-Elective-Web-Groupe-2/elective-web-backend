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
        '/test',
        '/mongo',
        '/docs',
        '/healthcheck',
        '/metrics',
        '/favicon.ico',
        '/product'
    ];

    if (authorizedRoutes.some(route => route === req.path)) {
        return next();
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