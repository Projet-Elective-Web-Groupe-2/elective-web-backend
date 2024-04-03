/**
 * Le fichier contenant les traitements liés à l'authentification.
 * @author GAURE Warren
 * @version 4.2
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const os = require('os');
const osUtils = require('os-utils');
const fs = require('fs')
const User = require('../models/userModel');

const logsPath = __dirname.replace('app/services', 'connectionLogs.txt');

/**
 * Fonction permettant de créér un client ou un livreur dans la base de données.
 * @param {String} email - L'email du client / livreur.
 * @param {String} password - Le mot de passe du client / livreur.
 * @param {String} userType - Le type de l'utilisateur ("CLIENT" ou "LIVREUR").
 * @param {String} firstName - Le prénom du client / livreur .
 * @param {String} lastName - Le nom du client / livreur.
 * @param {String} address - L'addresse du client / livreur.
 * @param {String} phoneNumber - Le numéro de téléphone du client / livreur.
 * @returns {object} Le client / livreur en question, ou false si rien n'a été créé.
*/
const createClientOrDeliverer = async (email, password, userType, firstName, lastName, address, phoneNumber) => {
    try {
        const newUser = new User({
            userID: Math.floor(Math.random() * 100),
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            userType: userType,
            address: address,
            referralCode: (Math.random() + 1).toString(36).substring(2),
            isSuspended: false
        });

        await newUser.save();

        return newUser;
    }
    catch(error) {
        throw new Error("Error while trying to create a client / deliverer in the database : " + error.message);
    }
}

/**
 * Fonction permettant de créer un restaurateur dans la base de données.
 * @param {String} email - L'email du restaurateur.
 * @param {String} password - Le mot de passe du restaurateur.
 * @param {String} userType - Le type de l'utilisateur ("RESTAURATEUR").
 * @param {String} phoneNumber - Le numéro de téléphone du restaurateur.
 * @returns {object} Le restaurateur en question, ou false si rien n'a été créé.
*/
const createRestaurateur = async (email, password, userType, phoneNumber) => {
    try {
        const newUser = new User({
            userID: Math.floor(Math.random() * 100),
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            userType: userType,
            referralCode: (Math.random() + 1).toString(36).substring(2),
            isSuspended: false
        });

        await newUser.save();

        return newUser;
    }
    catch(error) {
        throw new Error("Error while trying to create a restaurateur in the database : " + error.message);
    }
};

/**
 * Fonction permettant de créer un développeur tiers dans la base de données.
 * @param {String} email - L'email du développeur.
 * @param {String} password - Le mot de passe du développeur.
 * @param {String} userType - Le type de l'utilisateur ("DEVELOPPEUR TIERS").
 * @param {String} phoneNumber - Le numéro de téléphone du développeur.
 * @returns {object} Le développeur en question, ou false si rien n'a été créé.
 */
// TODO : Modifier la méthode pour générer la clé de sécurité et l'ajouter
const createDeveloper = async (email, password, userType, phoneNumber) => {
    try {
        const newUser = new User({
            userID: Math.floor(Math.random() * 100),
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            userType: userType,
            isSuspended: false
        });

        await newUser.save();

        return newUser;
    }
    catch(error) {
        throw new Error("Error while trying to create a developer in the database : " + error.message);
    }
};

/**
 * Fonction permettant de récupérer un utilsateur depuis la base de données grâce à son email.
 * @param {string} email - L'addresse email de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur en question, ou false si rien n'a été trouvé.
*/
const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });

        return user;
    }
    catch (error) {
        throw new Error("Error while trying to find user by email : " + error.message);
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
}

/**
 * Fonction permettant de vérifier si le mot de passe de l'utilisateur est correct.
 * @param {String} password - Le mot de passe de l'utilisateur dans la base de données.
 * @param {String} passwordToVerify - Le mot de passe à vérifier.
 * @returns {boolean} True si le mot de passe est correct, sinon une erreur est lancée.
*/
const comparePassword = async (password, passwordToVerify) => {
    const isPasswordCorrect = await bcrypt.compare(passwordToVerify + process.env.PEPPER_STRING, password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid password");
    }

    return isPasswordCorrect;
};

/**
 * Fonction permettant de générer un JSON Web Token destiné à l'utilisateur.
 * @param {Number} userID - L'ID de l'utilisateur.
 * @param {String} userType - Le type de l'utilisateur (client, livreur, restaurateur, etc...)
 * @returns {token} Le JSON Web Token.
*/
const generateJWT = (userID, userType) => {
    const token = jwt.sign({ id : userID, type : userType }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
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

/**
 * Fonction permettant d'écrire les logs dans un fichier.
 * @param {Number} useCase - Le cas d'utilisation à logger.
 * Cas possibles :
 * - 1 : Connexion réussie
 * - 2 : Email incorrect
 * - 3 : Mot de passe incorrect
 * - 4 : Compte suspendu
 * - 5 : Première connexion
 * @param {Number} id - L'id de l'utilisateur.
 * @param {String} type - Le type de l'utilisateur.
*/
const writeLogs = async (useCase, id, type) => {
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000;
    const localDate = new Date(currentDate.getTime() - timezoneOffset);
    localDate.setHours(localDate.getHours() + 2);
    let logMessage = `[${localDate.toLocaleString('fr-FR')}] `;

    switch (useCase) {
        case 1: {
            logMessage = logMessage + `User n°${id} (${type}) logged in\n`;
            break;
        }
        case 2: {
            logMessage = logMessage + `User tried to log in with incorrect email\n`;
            break;
        }
        case 3: {
            logMessage = logMessage + `User n°${id} (${type}) tried to log in with incorrect password\n`;
            break;
        }
        case 4: {
            logMessage = logMessage + `User n°${id} (${type}) tried to log in while being suspended\n`;
            break;
        }
        case 5: {
            logMessage = logMessage + `User n°${id} (${type}) logged in for the first time\n`;
            break;
        }
        default: {
            break;
        }
    }

    fs.appendFile(logsPath, logMessage, { flag: 'a+' }, (error) => {
        if (error) {
            console.error("Error while writing logs : ", error);
        }
    });
}

/**
 * Fonction permettant de récupérer le contenu du fichier de logs de connexion.
 * @returns {String} Le contenu du fichier de logs.
*/
const getLogs = () => {
    const logsContent = fs.readFileSync(logsPath, 'utf8');
    return logsContent.split('\n');
}

module.exports = {
    createClientOrDeliverer,
    createRestaurateur,
    createDeveloper,
    findUserByEmail,
    encryptPassword,
    comparePassword,
    generateJWT,
    getPerformanceMetrics,
    writeLogs,
    getLogs
};