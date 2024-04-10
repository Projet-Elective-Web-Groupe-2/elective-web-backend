/**
 * Le contrôleur contenant la logique métier associée aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const usersService = require('../services/usersService');
const RESTAURANT_URL = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/`;
const decodeJWT = require('../utils/decodeToken');

const getUser = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decodeToken = decodeJWT(accessToken)
    let userID = decodeToken.id;
    const userType = decodeToken.type;
    const targetUserID = req.headers["userid"];

    try {

        if (userType === "TECHNICAL") {
            throw new Error("Forbidden");
        }
        else if (userType === "SALES" && (userID === targetUserID)) {
            throw new Error("Forbidden");
        }
        else if (userType === "SALES") {
            userID = targetUserID;
        }
        const user = await usersService.getUser(userID);

        if (!user) {
            throw new Error("User not found");   
        }

        return res.status(200).json({ user });
    }
    catch (error) {
        if (error.message === "Invalid user ID") {
            res.status(400).json({ error: "Invalid user ID" });
        }
        else if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting user : ", error);
            res.status(500).json({ error: "User fetching failed" });
        }
    }
};


const getUserByEmail = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const email = req.headers["email"];

    if (!email) {
        return res.status(400).json({ error: "Missing mandatory data for user retrieval" });
    }

    try {

        const user = await usersService.getUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        return res.status(200).json({ user });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while getting user by email : ", error);
            res.status(500).json({ error: "User fetching failed" });
        }
        
    }
};

const getAllUsers = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decodeToken = decodeJWT(accessToken)
    const userType = decodeToken.type;

    try {
        if (userType != "SALES") {
            throw new Error("Invalid user type");
        }
        else if (userType === "TECHNICAL") {
            throw new Error("Forbidden");
        }

        const allUsers = await usersService.getAllUsers();

        if (!allUsers) {
            throw new Error("Users not found");
        }

        return res.status(200).json({ allUsers });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Users not found") {
            res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting all users : ", error);
            res.status(500).json({ error: "Users fetching failed" });
        }
    }
};

const editUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }
    const targetUserID = parseInt(req.body["userID"]);
    const firstName = req.body["firstName"];
    const lastName = req.body["lastName"];
    const address = req.body["address"];
    const email = req.body["email"];
    const phoneNumber = req.body["phoneNumber"];
    const password = req.body["password"]; 

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for edit" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(accessToken);
    const userID = decodedToken.id;
    const userType = decodedToken.type;
    let editedUser;

    try {
        const userToEdit = await usersService.getUser(targetUserID);
        const encryptedPassword = await usersService.encryptPassword(password);

        if (!userToEdit) {
            throw new Error("User not found");
        }
        else if (userType === "TECHNICAL") {
            throw new Error("Forbidden");
        }
        else if (userToEdit.userID !== targetUserID) {
            throw new Error("Wrong user ID in request body");
        }
        else if (targetUserID !== userID && userType !== "SALES") {
            throw new Error("User trying to edit another user without permission");
        }
        if (userType === "CLIENT" || userType === "DELIVERY" || userType === "DEVELOPER") {
            editedUser = await usersService.editUser(targetUserID, firstName, lastName, address, email, phoneNumber, encryptedPassword);
        }
        else if (userType === "RESTAURANT") {
            editedUser = await usersService.editUser(targetUserID, firstName, lastName, address, email, phoneNumber, encryptedPassword);
            // MEttre la route vers le truc Mongo
        }
        
        return res.status(200).json({ message: "User edited" });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Wrong user ID in request body") {
            res.status(400).json({ error: "Wrong user ID in request body" });
        }
        else if (error.message === "User trying to edit another user without permission") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "User trying to change their own type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "User trying to change their own suspension status") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while editing user : ", error);
            res.status(500).json({ error: "User editing failed" });
        }
    }
};

const suspendUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const targetUserID = req.body["userID"];

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for suspension" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SALES") {
            throw new Error("Invalid user type");
        }

        const userToSuspend = await usersService.getUser(targetUserID);

        if (!userToSuspend) {
            throw new Error("User not found");
        }
        else if (userToSuspend.id === targetUserID) {
            throw new Error("Wrong user ID in request body");
        }
        else if (userToSuspend.userType === "SALES") {
            throw new Error("User trying to suspend another commercial service user");
        }
        else if (userToSuspend.userType === "TECHNICAL") {
            throw new Error("User trying to suspend a technical service user");
        }

        await usersService.suspendUser(targetUserID);

        return res.status(200).json({ message: "User suspended" });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Wrong user ID in request body") {
            res.status(400).json({ error: "Wrong user ID in request body" });
        }
        else if (error.message === "User trying to suspend another commercial service user") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "User trying to suspend a technical service user") {
            res.status(403).json({ error: "Forbidden" });
        }
        else {
            console.error("Unexpected error while suspending user : ", error);
            res.status(500).json({ error: "User suspension failed" });
        }
    }
};

const unsuspendUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const targetUserID = req.body["userID"];

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for suspension" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SALES") {
            throw new Error("Invalid user type");
        }

        const userToSuspend = await usersService.getUser(targetUserID);

        if (!userToSuspend) {
            throw new Error("User not found");
        }

        await usersService.unsuspendUser(targetUserID);

        return res.status(200).json({ message: "User unsuspended" });
    }
    catch (error) {
        if (error.message === "Invalid user type") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else {
            console.error("Unexpected error while suspending user : ", error);
            res.status(500).json({ error: "User suspension failed" });
        }
    }
};

const deleteUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const targetUserID = parseInt(req.body["userID"]);

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for edit" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(accessToken);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    try {
        if (userType === "TECHNICAL") {
            throw new Error("Invalid user type");
        }
        const targetUser = await usersService.getUser(targetUserID);

        if (!targetUser) {
            throw new Error("User not found");
        }
        else if (targetUserID !== targetUser.userID) {
            throw new Error("Wrong user ID in request body");
        }
        else if (targetUserID !== userID && userType !== "SALES") {
            throw new Error("User trying to delete another user without permission");
        }
        else if (targetUserID === userID && targetUser.userType === userType && targetUser.userType === "SALES") {
            throw new Error("Commercial trying to delete themselves");
        }
        else if (targetUserID === userID && targetUser.userType === userType && targetUser.userType === "TECHNICAL") {
            throw new Error("Technical trying to delete themselves");
        }

        await usersService.deleteUser(targetUserID);

        // Delete le restaurant si delete le restaurateur
        if (targetUser.userType === "RESTAURANT") {
            // appelle a la route
            url = `${RESTAURANT_URL}find`;
            response = await axios.get(url, {
                params: { id: targetUserID },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (response.status !== 200) {
                throw new Error("Restaurant couldn't be deleted");
            }
        }

        return res.status(200).json({ message: "User deleted" });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Wrong user ID in request body") {
            res.status(400).json({ error: "Wrong user ID in request body" });
        }
        else if (error.message === "User trying to delete another user without permission") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Commercial trying to delete themselves") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Technical trying to delete themselves") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Invalid user type") {
        }
        else {
            console.error("Unexpected error while editing user : ", error);
            res.status(500).json({ error: "User editing failed" });
        }
    }
};

const metrics = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "TECHNICAL") {
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
    getUserByEmail,
    getAllUsers,
    editUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    metrics
};