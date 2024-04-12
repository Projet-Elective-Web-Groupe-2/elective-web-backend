/**
 * Le fichier contenant les traitements liés aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const os = require('os');
const osUtils = require('os-utils');
const bcrypt = require('bcryptjs');
const connection = require('../db/mySQLConnector');

/**
 * Fonction permettant de récupérer un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur correspondant à l'ID passé en paramètre.
*/
const getUser = async (userID) => {
    try {
        const sql = `SELECT * FROM users WHERE userID = ?`;
        const values = [userID];

        const [user] = await new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });

        return user;
    }
    catch (error) {
        throw new Error("Error while trying to find user by ID : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer un utilisateur en fonction de son email.
 * @param {String} email - L'email de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur correspondant à l'email passé en paramètre.
*/
const getUserByEmail = async (email) => {
    try {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const values = [email];

        const [user] = await new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });

        return user;
    }
    catch (error) {
        throw new Error("Error while trying to find user by email : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer tous les utilisateurs.
 * @returns {Array} Un tableau contenant tous les utilisateurs.
*/
const getAllUsers = async () => {
    try {
        const sql = "SELECT * FROM users WHERE userType IN ('CLIENT', 'RESTAURANT', 'DELIVERY', 'DEVELOPER')";

        const users = await new Promise((resolve, reject) => {
            connection.query(sql, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });

        return users;
    }
    catch (error) {
        throw new Error("Error while trying to fetch all users : " + error.message);
    }
};

/**
 * Fonction permettant de modifier un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à modifier.
 * @param {String} email - L'email de l'utilisateur.
 * @param {String} password - Le mot de passe de l'utilisateur.
 * @param {String} firstName - Le prénom de l'utilisateur.
 * @param {String} lastName - Le nom de l'utilisateur.
 * @param {String} address - L'addresse de l'utilisateur.
 * @param {String} phoneNumber - Le numéro de téléphone de l'utilisateur.
*/
const editUser = async (userID, firstName, lastName, address, email, phoneNumber, password) => {
    try {
        const sql = `UPDATE users SET firstName = ?, lastName = ?, address = ?, email = ?, phoneNumber = ?, password = ? WHERE userID = ?`;
        const values = [firstName, lastName, address, email, phoneNumber, password, userID];

        await new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    catch (error) {
        throw new Error("Error while updating user info : " + error.message);
    }
};

/**
 * Fonction permettant de crypter le mot de passe entré par l'utilisateur.
 * @param {String} password - Le mot de passe à crypter.
 * @returns {String} Le mot de passe crypté.
*/
const encryptPassword = async(password) => {
    const newPassword = await bcrypt.hash(password + process.env.PEPPER_STRING, 10);
    return newPassword;
};

/**
 * Fonction permettant de suspendre un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à suspendre.
*/
const suspendUser = async (userID) => {
    try {
        const sql = `UPDATE users SET isSuspended = true WHERE userID = ?`;
        const values = [userID];

        await new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    catch (error) {
        throw new Error("Error while suspending user : " + error.message);
    }
};

/**
 * Fonction permettant de réactiver un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à réactiver.
*/
const unsuspendUser = async (userID) => {
    try {
        const sql = `UPDATE users SET isSuspended = false WHERE userID = ?`;
        const values = [userID];

        await new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    catch (error) {
        throw new Error("Error while unsuspending user : " + error.message);
    }
};

/**
 * Fonction permettant de supprimer un utilisateur en fonction de son ID.
 * @param {String} userID - L'ID de l'utilisateur à supprimer.
*/
const deleteUser = async (userID) => {
    try {
        const sql = `DELETE FROM users WHERE userID = ?`;
        const values = [userID];

        await new Promise((resolve, reject) => {
            connection.query(sql, values, (error) => {
                if (error) {
                    reject(new Error(error.message));
                }
                else {
                    resolve();
                }
            });
        });
    }
    catch (error) {
        throw new Error("Error while deleting a user : " + error.message);
    }
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
    getUser,
    getUserByEmail,
    getAllUsers,
    editUser,
    encryptPassword,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getPerformanceMetrics
};