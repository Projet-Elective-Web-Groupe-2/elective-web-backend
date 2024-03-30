/**
 * Le fichier contenant les requêtes liées au monitoring.
 * @author GAURE Warren
 * @version 1.0
*/

const os = require('os');
const axios = require('axios');

/**
 * Fonction permettant de récupérer les métriques de performance de l'application, à savoir :
 * - CPU usage (usage du CPU)
 * - Total memory (mémoire totale)
 * - Free memory (mémoire inutilisée)
 * - Used memory (mémoire utilisée)
 * - Elapsed time (temps de réponse)
 * @returns {object} Un objet contenant les métriques de performance de l'application.
*/
const getPerformanceMetrics = () => {
    const startTime = Date.now();

    const cpuUsage = os.cpuUsage();
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = os.totalmem() - os.freemem();

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    return {
        cpuUsage: cpuUsage,
        totalMemory: totalMemory,
        freeMemory: freeMemory,
        usedMemory: usedMemory,
        elapsedTime: elapsedTime
    }
};

/**
 * Fonction permettant de faire appel au endpoint de métrique de chaque autre microservice et de les collecter.
 * @param {string} microservice - Le nom du microservice à appeler.
 * @param {jwt} token - Le token d'authentification de l'utilisateur.
 * @returns {Promise} - Les métriques de performance du microservice.
*/
async function getMetrics(microservice, token) {
    try {
        const url = `http://${microservice}/metrics`;
        const response = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Error while collecting metrics from ${microservice.split('/')[0]} microservice : ${error.message}`);
    }
};

module.exports = {
    getPerformanceMetrics,
    getMetrics   
};