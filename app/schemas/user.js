/**
 * Le schéma représentant un utilisateur.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma de base pour un utilisateur (tous types confondus)
const userSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true },
    email: { type: String, unique: false, required: true },
    password: { type: String, unique: true, required: true },
    firstname: { type: String, unique: false, required: false },
    lastname: { type: String, unique: false, required: false }
});

module.exports = userSchema;