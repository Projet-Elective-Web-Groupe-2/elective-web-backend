/**
 * Le routeur pour l'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);
router.post('/register', authenticationController.register);
router.post('/refreshToken', authenticationController.refreshToken);

module.exports = router;