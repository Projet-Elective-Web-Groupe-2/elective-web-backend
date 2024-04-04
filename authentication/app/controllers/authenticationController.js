/**
 * Le contrôleur contenant la logique métier associée à chaque route d'authentification.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios');
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
        else if (existingUser.isSuspended === true) {
            throw new Error("User is suspended");
        }

        await authenticationService.verifyRefreshToken(existingUser.refreshToken);

        await authenticationService.comparePassword(existingUser.password, password);
        
        const accessToken = authenticationService.generateAccessToken(existingUser.userID, existingUser.userType);

        await authenticationService.writeLogs(1, existingUser.userID, existingUser.userType);

        return res.status(200).json({ accessToken });
    }
    catch (error) {
        if (error.message === "User not found") {
            await authenticationService.writeLogs(2, null, null);
            return res.status(404).json({ error : error.message });
        }
        else if (error.message === "Invalid password") {
            await authenticationService.writeLogs(3, existingUser.userID, existingUser.userType);
            return res.status(401).json({ error : error.message });
        }
        else if (error.message === "User is suspended") {
            await authenticationService.writeLogs(4, existingUser.userID, existingUser.userType);
            return res.status(403).json({ error : error.message });
        }
        else if (error.message === "Expired refresh token") {
            return res.status(401).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while logging in : ", error);
            res.status(500).json({ error: "Login failed" });
        }
    }
};

const logout = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(accessToken);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    try {
        res.clearCookie("accessToken");

        await authenticationService.writeLogs(7, userID, userType);

        res.status(200).json({ message: "Logged out successfully" });
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
        let accessToken;
        let refreshToken;

        switch(userType) {
            case "CLIENT":
            case "LIVREUR":
            // For testing purposes
            /*case "SERVICE TECHNIQUE":*/ {
                const firstName = req.body["firstName"];
                const lastName = req.body["lastName"];
                const address = req.body["address"];
                
                if (!firstName ||!lastName ||!address) {
                    throw new Error("Missing mandatory data");
                }
                
                refreshToken = authenticationService.generateRefreshToken(email);
                newUser = await authenticationService.createClientOrDeliverer(email, encryptedPassword, userType, firstName, lastName, address, phoneNumber, refreshToken);

                break;
            }
            case "RESTAURATEUR": {
                const restaurantName = req.body["restaurantName"];
                const restaurantAddress = req.body["restaurantAddress"];

                if (!restaurantName || !restaurantAddress) {
                    throw new Error("Missing mandatory data");
                }

                refreshToken = authenticationService.generateRefreshToken(email);

                newUser = await authenticationService.createRestaurateur(email, encryptedPassword, userType, phoneNumber, refreshToken);
                
                accessToken = authenticationService.generateAccessToken(newUser.userID, newUser.userType);
                
                const url = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/create`;

                const response = await axios.post(url, {
                    name: restaurantName,
                    address: restaurantAddress,
                    ownerID: newUser.userID
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.status !== 201) {
                    throw new Error("Failed to create restaurant");
                }

                break;
            }
            case "DEVELOPPEUR TIERS": {
                refreshToken = authenticationService.generateRefreshToken(email);
                
                newUser = await authenticationService.createDeveloper(email, encryptedPassword, userType, phoneNumber, refreshToken);
                
                break;
            }
            default: {
                throw new Error("Invalid user type");
            }
        }

        await authenticationService.writeLogs(5, newUser.userID, newUser.userType);

        return res.status(200).json({ message: "User registered successfully" });
    }
    catch(error) {
        if (error.message === "User already exists") {
            return res.status(409).json({ error : error.message });
        }
        else if (error.message === "Missing mandatory data") {
            return res.status(400).json({ error: `Missing mandatory data to create a ${userType}` });
        }
        else if (error.message === "Failed to create restaurant") {
            return res.status(500).json({ error: "Failed to create restaurant" });
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

const findUser = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ error: "Required query parameter is missing" });
    }

    const userID = req.query.id;

    if (!userID) {
        return res.status(400).json({ error: "Missing mandatory data" });
    }

    try {
        const user = await authenticationService.findUserByID(userID);

        if (!user) {
            throw new Error("User not found");
        }

        return res.status(200).json({ user });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while finding a user : ", error);
            return res.status(500).send({ error: error.message });
        }
    }
};

const token = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const refreshToken = req.body["refreshToken"];

    if (!refreshToken) {
        return res.status(400).json({ error: "Missing mandatory data for token renewal" });
    }

    let email;
    let existingUser;
    let accessToken;

    try {
        email = authenticationService.decodeRefreshToken(refreshToken);

        existingUser = await authenticationService.findUserByEmail(email);

        if (!existingUser) {
            throw new Error("User not found");
        }
        else if (existingUser.isSuspended === true) {
            throw new Error("User is suspended");
        }

        await authenticationService.verifyRefreshToken(refreshToken);

        if (existingUser.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token");
        }
        
        accessToken = authenticationService.generateAccessToken(existingUser.userID, existingUser.userType);

        await authenticationService.writeLogs(6, existingUser.userID, existingUser.userType);

        return res.status(200).json({ accessToken });
    }
    catch(error) {
        if (error.message === "Invalid refresh token") {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        else if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "User is suspended") {
            return res.status(403).json({ error: "User is suspended" });
        }
        else if (error.message === "Expired refresh token") {
            const newRefreshToken = authenticationService.generateRefreshToken(email);

            await authenticationService.updateRefreshToken(existingUser.userID, newRefreshToken);

            accessToken = authenticationService.generateAccessToken(existingUser.userID, existingUser.userType);

            await authenticationService.writeLogs(6, existingUser.userID, existingUser.userType);

            return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
        }
        else {
            console.error("Unexpected error while verifying refresh token : ", error);
            res.status(500).json({ error: "Token renewal failed" });
        }
    }
};

const logs = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        const logs = await authenticationService.getLogs();

        return res.status(200).json({ logs });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        console.error("Unexpected error while retrieving logs : ", error);
        res.status(500).json({ error: "Failed to retrieve logs" });
    }
};

const metrics = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

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
    findUser,
    token,
    logs,
    metrics
};