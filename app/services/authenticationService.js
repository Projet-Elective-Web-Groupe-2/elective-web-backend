/**
 * Le module contenant les requêtes liées à l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Fonction permettant de récupérer un utilsateur depuis la base de données grâce à son email.
 * @param {string} email - L'addresse email de l'utilisateur à récupérer.
 * @returns {object} L'utilisateur en question, ou false si rien n'a été trouvé.
*/
const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw new Error("Error while trying to find user by email : " + error.message);
    }
};

/**
 * Fonction permettant de créér un client ou un livreur dans la base de données.
 * @param {String} email - L'email du client / livreur.
 * @param {String} password - Le mot de passe du client / livreur.
 * @param {String} userType - Le type de l'utilisateur ("CLIENT" ou "LIVREUR").
 * @param {String} firstName - Le prénom du client / livreur .
 * @param {String} lastName - Le nom du client / livreur.
 * @param {String} address - L'addresse du client / livreur.
 * @param {String} phoneNumber - Le numéro de téléphone du client / livreur.
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
        });

        await newUser.save();
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
*/
const createRestaurateur = async (email, password, userType, phoneNumber) => {
    try {
        const newUser = new User({
            userID: Math.floor(Math.random() * 100),
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            userType: userType,
        });

        await newUser.save();
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
 */
const createDeveloper = async (email, password, userType, phoneNumber) => {
    try {
        const newUser = new User({
            userID: Math.floor(Math.random() * 100),
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            userType: userType,
        });

        await newUser.save();
    }
    catch(error) {
        throw new Error("Error while trying to create a developer in the database : " + error.message);
    }
};

/**
 * Fonction permettant de vérifier si le mot de passe de l'utilisateur est correct.
 * @param {String} password - Le mot de passe de l'utilisateur dans la base de données.
 * @param {String} passwordToVerify - Le mot de passe à vérifier.
 * @returns {boolean} True si le mot de passe est correct, false sinon.
*/
const comparePassword = async (password, passwordToVerify) => {
    const isPasswordCorrect = await bcrypt.compare(passwordToVerify + process.env.PEPPER_STRING, password);
    return isPasswordCorrect;
};

/**
 * Fonction permettant de générer un JSON Web Token destiné à l'utilisateur.
 * @param {Number} userID - L'ID de l'utilisateur.
 * @param {String} userType - Le type de l'utilisateur (client, livreur, restaurateur, etc...)
 * @returns {token} Le JSON Web Token.
*/
const generateJWT = (userID, userType) => {
    const token = jwt.sign({ id : userID, type : userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = {
    findUserByEmail,
    createClientOrDeliverer,
    createRestaurateur,
    createDeveloper,
    comparePassword,
    generateJWT
};