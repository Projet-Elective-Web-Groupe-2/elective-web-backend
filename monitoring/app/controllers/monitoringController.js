/**
 * Le contrôleur contenant la logique métier associée à chaque route de monitoring.
 * @author GAURE Warren
 * @version 1.0
*/

const monitoringService = require('../services/monitoringService');
const decodeJWT = require('../utils/decodeToken');

const getMetrics = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = decodeJWT(token);

        if (decodedToken.type !== "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        let projectMetrics = {
            authenticationMetrics: {},
            componentsMetrics: {},
            deliveryMetrics: {},
            menuMetrics: {},
            monitoringMetrics: {},
            orderMetrics: {},
            productMetrics: {},
            restaurantMetrics: {},
            userMetrics: {}
        }

        projectMetrics.monitoringMetrics = monitoringService.getPerformanceMetrics();
        projectMetrics.authenticationMetrics = await monitoringService.getMetrics("authentication-service/auth", token);

        return res.status(200).json({ metrics });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting metrics :", error);
            res.status(500).json({ error: "Failed to get metrics" });
        }
    }
};

module.exports = {
    getMetrics
}