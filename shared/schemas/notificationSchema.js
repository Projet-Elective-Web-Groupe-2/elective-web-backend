/**
 * Le schéma représentant une notification.
 * @author GAURE Warren
 * @version 1.0
*/

const mongoose = require('mongoose');

// Définition du schéma pour une notification.
const notificationSchema = new mongoose.Schema({
    userID: {
        type: Number,
        unique: false,
        required: true
    },
    type: {
        type: String,
        unique: false,
        required: true
    },
    title: {
        type: String,
        unique: false,
        required: true
    },
    text: {
        type: String,
        unique: false,
        required: true
    },
    seen: {
        type: Boolean,
        unique: false,
        required: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);