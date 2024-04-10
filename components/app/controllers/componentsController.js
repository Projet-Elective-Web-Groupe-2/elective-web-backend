/**
 * Le contrôleur contenant la logique métier associée à chaque route de composants.
 * @author GAURE Warren
 * @version 1.0
*/

const componentsService = require('../services/componentsService');

const writeLogs = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userID = req.decoded.id;
    const userType = req.decoded.type;
    const componentName = req.body.componentName;

    if (userType != "DEVELOPER") {

    await componentsService.writeLogs(userID, componentName);
    res.status(200).send('Logs written successfully!');
};

const getLogs = (req, res) => {
    const logs = componentsService.getLogs();
    res.status(200).send(logs);
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