/**
 * Le contrôleur contenant la logique métier associée à chaque route d'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const authenticationService = require('../services/authenticationService');

const login = async (req, res) => {
    // Vérification de la présence du body dans la requête
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    // Vérification de la présence des informations obligatoires dans le corps de la requête
    const email = req.body["email"];
    const password = req.body["password"];

    if (!email || !password) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        // Vérification de l'existence de l'utilisateur dans la base de données
        const existingUser = await authenticationService(email);

        if (!existingUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Vérification du mot de passe
        const isPasswordCorrect = await bcrypt.compare(password + process.env.PEPPER_STRING, existingUser.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Génération du token
        const token = jwt.sign({ id: existingUser._id, userType: existingUser.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error while trying to login : ", error);
        res.status(500).json({ error: "Login failed" });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: "Successfully disconnected" });
};

const register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const email = req.body["email"];
    const password = req.body["password"];
    const userType = req.body["userType"];

    if (!email || !password ||!userType) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    const existingUser = authenticationService(email);
    
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }
            
    // Cryptage du mot de passe
    const hashedPassword = await bcrypt.hash(password + process.env.PEPPER_STRING, 10);

    let newUser;

    try {
        // On créé un nouvel utilisateur et on l'ajoute à la base de données
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        
        await newUser.save();
        
        res.status(201).json({ message: "Successfully registered" });
    }
    catch (error) {
        console.error("Erreur pendant l'inscription d'un utilisateur : ", error);
        res.status(500).json({ error: 'Inscription échouée' });
    }
};

module.exports = {
    login,
    logout,
    register,
};