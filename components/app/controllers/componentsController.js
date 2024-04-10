/**
 * Le contrôleur contenant la logique métier associée à chaque route de composants.
 * @author GAURE Warren
 * @version 1.0
*/

const axios = require('axios')
const componentsService = require('../services/componentsService');

const writeLogs = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;
    const componentName = req.body.componentName;

    if (userType != "DEVELOPER") {
        return res.status(403).send({ message: "Forbidden" });
    }
    else if (!componentName) {
        return res.status(400).send({ message: "Missing component name" });
    }

    try {
        const url = `${AUTH_URL}find`;
        const response = await axios.get(url, {
            params: { id: userID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        await componentsService.writeLogs(userID, componentName);

        return res.status(200).send('Logs written successfully!');
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).send({ error: error.message });
        }
        else {
            console.error("Unexpected error while writing logs : ", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const getLogs = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;

    if (userType != "TECHNICAL ") {
        return res.status(403).send({ message: "Forbidden" });
    }
    try {
        const url = `${AUTH_URL}find`;
        const response = await axios.get(url, {
            params: { id: userID },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
            throw new Error("User not found");
        }

        const logs = await componentsService.getLogs();

        return res.status(200).json({ logs });
    }
    catch (error) {
        if (error.message === "User not found") {
            return res.status(404).send({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting logs : ", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

const metrics = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "Missing token" });
    }

    const token = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(token).type;

    try {
        if (userType != "TECHNICAL") {
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
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = {
    writeLogs,
    getLogs,
    metrics
};