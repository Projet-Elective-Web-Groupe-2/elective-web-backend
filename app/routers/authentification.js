const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/user');

const router = express.Router();

// POST /register - User registration endpoint
router.post('/register', async (req, res) => {
  try {
    // On récupère les infos de l'utilisateur depuis le body de la requête
    const { username, email, password, firstName, lastName } = req.body;

    // On vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "L'utilisateur existe déjà" });
    }

    // On hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // On créé un nouvel utilisateur
    const newUser = new user({
      username: username,
      email: password,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    });

    // On ajoute le nouvel utilisateur à la base de données
    await newUser.save();

    // On renvoie un message à l'utilisateur
    res.status(201).json({ message: "Inscription déroulée avec succès" });
  }
  catch (error) {
    console.error("Erreur pendant l'inscription d'un utilisateur : ", error);
    res.status(500).json({ error: 'Inscription échouée' });
  }
});

module.exports = router;