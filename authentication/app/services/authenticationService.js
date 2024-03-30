/**
 * Le fichier contenant les requêtes liées à l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const os = require('os');
const osUtils = require('os-utils');
const User = require('../models/userModel');

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
const getPerformanceMetrics = () => {
    const startTime = Date.now();

    const cpuUsage = osUtils.cpuUsage((cpuUsage) => {
        return cpuUsage * 100;
    });
    
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

module.exports = {
    createClientOrDeliverer,
    createRestaurateur,
    createDeveloper,
    findUserByEmail,
    encryptPassword,
    comparePassword,
    generateJWT,
    getPerformanceMetrics
};