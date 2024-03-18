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
    // On vérifie la présence du body dans la requête
    if (!req.body) {
        return res.status(400).json({ error: "Corps de la requête manquant" });
    }

    // On vérifie la présence des informations obligatoires dans le corps de la requête
    const email = req.body["email"];
    const password = req.body["password"];

    if (!email || !password) {
        return res.status(400).json({ error: "Veuillez renseigner les données" });
    }

    try {
        // On vérifie si l'utilisateur existe déjà grâce à son email
        const existingUser = await authenticationService(email);

        if (!existingUser) {
            return res.status(400).json({ error: "L'utilisateur n'existe pas" });
        }

        // On vérifie si le mot de passe est correct
        const isPasswordCorrect = await bcrypt.compare(password + process.env.PEPPER_STRING, existingUser.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }

        // Si on arrive à cette étape du programme, tout est bon et on peut générer le token
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Erreur pendant la connexion d'un utilisateur : ", error);
        res.status(500).json({ error: 'Connexion échouée' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: "Déconnexion réussie" });
};

const register = async (req, res) => {
    // On récupère les données du nouvel utilisateur
    const { firstName, lastName, email, password } = req.body;

    try {
        // On vérifie si l'utilisateur existe déjà grâce à son email
        const existingUser = authenticationService(email);

        if (existingUser) {
            return res.status(400).json({ error: "L'utilisateur existe déjà" });
        }
        
        // On hash le mot de passe
        const hashedPassword = await bcrypt.hash(password + process.env.PEPPER_STRING, 10);
        
        // On créé un nouvel utilisateur et on l'ajoute à la base de données
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        
        await newUser.save();
        
        res.status(201).json({ message: "Inscription déroulée avec succès" });
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