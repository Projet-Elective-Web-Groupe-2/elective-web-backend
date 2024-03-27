/**
 * Le contrôleur contenant la logique métier associée à chaque route d'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

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
        return res.status(400).json({ error: "Missing mandatory data for verification" });
    }

    try {
        // Appel au service d'authentification pour vérifier l'existence de l'utilisateur dans la base de données
        const existingUser = await authenticationService.findUserByEmail(email);

        // Appel au service d'authentification pour vérifier le mot de passe
        const isPasswordCorrect = await authenticationService.comparePassword(existingUser.password, password);
        
        // Appel au service d'authentification pour générer le token
        const token = authenticationService.generateJWT(existingUser.userID, existingUser.userType);

        return res.status(200).json({ token });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error : error.message });
        }
        else if (error.message === "Invalid password") {
            return res.status(401).json({ error : error.message });
        }
        else {
            console.error("Unexpected error while logging in : ", error);
            res.status(500).json({ error: "Login failed" });
        }
    }
};

const logout = (req, res) => {
    try {
        // Suppression du token
        res.clearCookie("token");

        res.status(200).json({ message: "Logout successful" });
    }
    catch(error) {
        console.error("Unexpected error while logging out : ", error);
        res.status(500).json({ error: "Logout failed" });
    }
};

const register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const email = req.body["email"];
    // La variable changera de valeur
    const password = req.body["password"];
    const userType = req.body["userType"];
    const phoneNumber = req.body["phoneNumber"];

    if (!email || !password || !userType || !phoneNumber) {
        return res.status(400).json({ error: "Missing mandatory data for registration" });
    }

    try {
        // Vérification de l'existence de l'utilisateur dans la base de données
        const existingUser = await authenticationService.findUserByEmail(email);
    
        if (existingUser) {
            throw new Error("User already exists");
        }

        const encryptedPassword = await authenticationService.encryptPassword(password);

        let newUser;

        switch(userType) {
            case "CLIENT":
            case "LIVREUR": {
                const firstName = req.body["firstName"];
                const lastName = req.body["lastName"];
                const address = req.body["address"];
                
                if (!firstName ||!lastName ||!address) {
                    throw new Error("Missing mandatory data");
                }

                newUser = await authenticationService.createClientOrDeliverer(email, encryptedPassword, userType, firstName, lastName, address, phoneNumber);
                
                break;
            }
            case "RESTAURATEUR": {
                newUser = await authenticationService.createRestaurateur(email, encryptedPassword, userType, phoneNumber);

                // TODO : Implémenter la création d'un restaurant dans la base MongoDB

                break;
            }
            case "DEVELOPPEUR TIERS": {
                // TODO : Penser à modifier la méthode pour inclure la clé de sécurité
                newUser = await authenticationService.createDeveloper(email, encryptedPassword, userType, phoneNumber);

                break;
            }
            default: {
                throw new Error("Invalid user type");
            }
        }
    }
    catch(error) {
        if (error.message === "User already exists") {
            return res.status(400).json({ error : error.message });
        }
        else if (error.message === "Missing mandatory data") {
            return res.status(400).json({ error: `Missing mandatory data to create a ${userType}` });
        }
        else if (error.message === "Invalid user type") {
            return res.status(400).json({ error: "Invalid user type"});
        }
        else {
            console.error("Unexpected error while registering : ", error);
            res.status(500).json({ error: "Registration failed" });
        }
    }

    const token = authenticationService.generateJWT(newUser.userID, newUser.userType);

    return res.status(200).json({ token });
};

module.exports = {
    login,
    logout,
    register
};