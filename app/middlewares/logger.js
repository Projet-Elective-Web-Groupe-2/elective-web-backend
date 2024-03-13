// Middleware de logging des requêtes

function logger(req, res, next) {
    // On récupère la date actuelle pour calculer le temps de réponse
    const start = Date.now();
    // Écouteur d'évènement : dès que la réponse est envoyée au client, alors on fait...
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration} ms)`);
    });
    next();
}

// On exporte la fonction pour qu'elle soit accessible dans tout le programme
module.exports = logger;