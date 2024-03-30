/**
 * Le fichier contenant les requêtes liées au monitoring.
 * @author GAURE Warren
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
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
const getPerformanceMetrics = async () => {
    const startTime = Date.now();

    const cpuUsage = await getCpuUsage();
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    const metrics =  {
        cpuUsage: `${cpuUsage}%`,
        totalMemory: `${(totalMemory / (1024 * 1024)).toFixed(2)} Mo`,
        freeMemory: `${(freeMemory / (1024 * 1024)).toFixed(2)} Mo`,
        usedMemory: `${(usedMemory / (1024 * 1024)).toFixed(2)} Mo`,
        elapsedTime: `${elapsedTime} ms`
    }

    return metrics;
};

/**
 * Fonction permettant de retourner le taux d'utilisation du CPU.
 * @returns Le taux d'utilisation du CPU.
*/
function getCpuUsage() {
    return new Promise((resolve) => {
        osUtils.cpuUsage((usage) => {
            resolve((usage * 100).toFixed(2));
        });
    });
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
        throw new Error(`Error while collecting metrics from ${microservice.split('-')[0]} microservice : ${error.message}`);
    }
};

module.exports = {
    getPerformanceMetrics,
    getMetrics   
};