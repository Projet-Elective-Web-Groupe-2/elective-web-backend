/**
 * Le modèle représentant une notification.
 * @author GAURE Warren
 * @version 1.0
*/

const notificationSchema = require('../schemas/notificationSchema');

// Définition du modèle pour une notification.
const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = notificationModel;