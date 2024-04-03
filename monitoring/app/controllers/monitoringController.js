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

        const authentication = await monitoringService.getMetrics(`${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth`, token);
        //const users = await monitoringService.getMetrics(`${process.env.USERS_HOST}:${process.env.USERS_PORT}/user`, token);
        const restaurant = await monitoringService.getMetrics(`${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant`, token);
        //const menu = await monitoringService.getMetrics(`${process.env.MENU_HOST}:${process.env.MENU_PORT}/menu`, token);
        const product = await monitoringService.getMetrics(`${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/product`, token);
        //const order= await monitoringService.getMetrics(`${process.env.ORDER_HOST}:${process.env.ORDER_PORT}/order`, token);
        //const delivery = await monitoringService.getMetrics(`${process.env.DELIVERY_HOST}:${process.env.DELIVERY_PORT}/delivery`, token);
        const monitoring = await monitoringService.getPerformanceMetrics();
        //const components = await monitoringService.getMetrics(`${process.env.COMPONENT_HOST}:${process.env.COMPONENT_PORT}/components`, token);

        return res.status(200).json({
            authentication,
            //users,
            restaurant,
            //menu,
            product,
            //order,
            //delivery,
            monitoring,
            //components
        });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting metrics : ", error);
            res.status(500).json({ error: "Failed to get metrics" });
        }
    }
};

module.exports = {
    getMetrics
}