/**
 * Le modèle représentant un utilisateur (tous types confondus).
 * @author GAURE Warren
 * @version 1.0
 */

const userSchema = require('../schemas/userSchema');

// Définition du modèle pour un utilisateur.
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;