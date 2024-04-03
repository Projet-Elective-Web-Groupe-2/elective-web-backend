/**
 * Le contrôleur contenant la logique métier associée aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const usersService = require('../services/usersService');
const decodeJWT = require('../utils/decodeToken');

const getUser = async (req, res) => {

};

const editUser = async (req, res) => {

};

const suspendUser = async (req, res) => {


};

const unsuspendUser = async (req, res) => {


};

const deleteUser = async (req, res) => {

};

const metrics = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SERVICE TECHNIQUE") {
            throw new Error("Invalid user type");
        }

        const metrics = await usersService.getPerformanceMetrics();

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
    getUser,
    editUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    metrics
};