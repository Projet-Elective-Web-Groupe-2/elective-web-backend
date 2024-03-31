/**
 * Le contrôleur contenant la logique métier associée à chaque route d'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const authenticationService = require('../services/authenticationService');
const decodeJWT = require('../utils/decodeToken');

const login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const email = req.body["email"];
    const password = req.body["password"];

    if (!email || !password) {
        return res.status(400).json({ error: "Missing mandatory data for verification" });
    }

    try {
        const existingUser = await authenticationService.findUserByEmail(email);

        if (!existingUser) {
            throw new Error("User not found");
        }

        authenticationService.comparePassword(existingUser.password, password);
        
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
    const password = req.body["password"];
    const userType = req.body["userType"];
    const phoneNumber = req.body["phoneNumber"];

    if (!email || !password || !userType || !phoneNumber) {
        return res.status(400).json({ error: "Missing mandatory data for registration" });
    }

    try {
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
        
        const token = authenticationService.generateJWT(newUser.userID, newUser.userType);
        
        return res.status(200).json({ token });
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
};

const metrics = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    try {
        if (userType != "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        const metrics = await authenticationService.getPerformanceMetrics();

        return res.status(200).json({ metrics });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting metrics : ", error);
            res.status(500).json({ error: "Metrics collecting failed" });
        }
    }
};

module.exports = {
    login,
    logout,
    register,
    metrics
};