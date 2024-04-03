/**
 * Le fichier contenant les traitements liés aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');


/**
 * Fonction permettant de récupérer un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur correspondant à l'ID passé en paramètre.
*/
const getUser = async (userID) => {

    // return user à trouver
};

/**
 * Fonction permettant de récupérer un utilisateur en fonction de son email.
 * @param {String} email - L'email de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur correspondant à l'email passé en paramètre.
*/
const getUserByEmail = async (email) => {

    // return user à trouver
};

/**
 * Fonction permettant de récupérer tous les utilisateurs.
 * @returns {Array} Un tableau contenant tous les utilisateurs.
*/
const getAllUsers = async () => {

    // return tous les users
}

/**
 * Fonction permettant de modifier un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à modifier.
 * @param {objet} edits - Les modifications à apporter à l'utilisateur.
 * @returns {object} L'utilisateur modifié.
 */
const editUser = async (userID, edits) => {
    // edits est un objet JSON contenant toutes les modification à apporter
    // Demande à Paul ou Théo pour plus d'infos
    // return user modifié
}

/**
 * Fonction permettant de suspendre un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à suspendre.
*/
const suspendUser = async (userID) => {

    // rien return, juste suspendre l'utilisateur (modifier le booléen du coup)
}

/**
 * Fonction permettant de réactiver un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à réactiver.
*/
const unsuspendUser = async (userID) => {

    // rien return, juste réactiver l'utilisateur (modifier le booléen du coup)
}

/**
 * Fonction permettant de supprimer un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à supprimer.
*/
const deleteUser = async (userID) => {
    
    // rien return, juste supprimer l'utilisateur
}

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
    getUser,
    getAllUsers,
    editUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getPerformanceMetrics
};