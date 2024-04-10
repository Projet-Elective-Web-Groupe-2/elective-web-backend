/**
 * Le fichier contenant les traitements liés aux composants réutilisables.
 * @author GAURE Warren
 * @version 1.0
*/

const fs = require('fs');
const os = require('os');
const osUtils = require('os-utils');

const logsPath = __dirname.replace('app/services', 'componentLogs.txt');

/**
 * Fonction permettant d'écrire les logs de téléchargement des composants réutilisables.
 * @param {Number} userID - L'identifiant de l'utilisateur ayant téléchargé le composant.
 * @param {String} componentName - Le nom du composant téléchargé.
*/
const writeLogs = async (userID, componentName) => {
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000;
    
    const localDate = new Date(currentDate.getTime() - timezoneOffset);
    localDate.setHours(localDate.getHours() + 2);
    
    let logMessage = `[${localDate.toLocaleString('fr-FR')}] User n°${userID} downloaded the component ${componentName}.\n`;

    fs.appendFile(logsPath, logMessage, {flag: 'a+'}, (error) => {
        if (error) {
            console.error(error);
        }
    });
};

/**
 * Fonction permettant de récupérer le contenu du fichier de logs de connexion.
 * @returns {String} Le contenu du fichier de logs.
*/
const getLogs = () => {
    const logsContent = fs.readFileSync(logsPath, 'utf8');
    return logsContent.split('\n');
};

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

    return {
        cpuUsage: `${cpuUsage}%`,
        totalMemory: `${(totalMemory / (1024 * 1024)).toFixed(2)} Mo`,
        freeMemory: `${(freeMemory / (1024 * 1024)).toFixed(2)} Mo`,
        usedMemory: `${(usedMemory / (1024 * 1024)).toFixed(2)} Mo`,
        elapsedTime: `${elapsedTime} ms`
    }
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

module.exports = {
    writeLogs,
    getLogs,
    getPerformanceMetrics
};