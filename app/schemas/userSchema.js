/**
 * Le schéma représentant un utilisateur (tous types confondus).
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour un utilisateur.
const userSchema = new mongoose.Schema({
    userID: {
        type: Number,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        unique: false,
        required: false
    },
    lastName: {
        type: String,
        unique: false,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: false,
        required: true
    },
    userType: {
        type: String,
        unique: false,
        required: true
    },
    address: {
        type: String,
        unique: false,
        required: false
    },
    referredBy: {
        type: Number,
        unique: true,
        required: false
    },
    referrerOf: {
        type: Number,
        unique: true,
        required: false
    },
    referralCode: {
        type: String,
        unique: true,
        required: false
    },
    isSuspended: {
        type: Boolean,
        unique: false,
        required: true
    }
});

module.exports = userSchema;