/**
 * Le fichier contenant les routes d'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

// Route pour se connecter
router.post('/login', authenticationController.login);
// Route pour se déconnecter
router.post('/logout', authenticationController.logout);
// Route pour s'inscrire
router.post('/register', authenticationController.register);
// Route pour rafraîchir le token
router.post('/refreshToken', authenticationController.refreshToken);

module.exports = router;