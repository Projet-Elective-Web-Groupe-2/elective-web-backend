/**
 * Middleware de logging des requêtes.
 * @author GAURE Warren
 * @version 1.0
*/

/**
 * Fonction pour afficher les logs directement dans la console du serveur.
 * @param {Object} req La requête HTTP
 * @param {Object} res La réponse HTTP
 * @param {Function} next Le prochain middleware
*/
function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
}

module.exports = logger;