// Middleware de logging des requêtes
function logger(req, res, next) {
    // On récupère la date actuelle pour calculer le temps de réponse
    const start = Date.now();
    // On écoute l'évènement "dès que la réponse est envoyée au client"
    res.on('finish', () => {
      console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode} (${Date.now() - start} ms)`);
    });
    next();
}

// On exporte la fonction pour qu'elle soit accessible dans tout le programme
module.exports = logger;