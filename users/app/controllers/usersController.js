/**
 * Le contrôleur contenant la logique métier associée aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const usersService = require('../services/usersService');
const decodeJWT = require('../utils/decodeToken');

const getUser = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userID = decodeJWT(accessToken).id;
    console.log("userID:", userID); // Log userID
    try {
        if (!userID) {
            throw new Error("Invalid user ID " + userID); // Include userID in the error message
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

    const email = req.body["email"];

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
        else {
            console.error("Unexpected error while getting user by email : ", error);
            res.status(500).json({ error: "User fetching failed" });
        }
    }
};

const getAllUsers = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SERVICE COMMERCIAL") {
            throw new Error("Invalid user type");
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

    const edits = req.body["edits"];
    const targetUserID = req.body["id"];

    if (!edits || !targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for edit" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(accessToken);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    try {
        const userToEdit = await usersService.getUser(targetUserID);

        if (!userToEdit) {
            throw new Error("User not found");
        }
        else if (userToEdit.id !== targetUserID) {
            throw new Error("Wrong user ID in request body");
        }
        else if (targetUserID !== userID && userType !== "SERVICE COMMERCIAL") {
            throw new Error("User trying to edit another user without permission");
        }
        else if (targetUserID === userID && edits["type"]) {
            throw new Error("User trying to change their own type");
        }
        else if (targetUserID === userID && edits["isSuspended"]) {
            throw new Error("User trying to change their own suspension status");
        }

        const editedUser = await usersService.editUser(targetUserID, edits);

        return res.status(200).json({ editedUser });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
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

    const targetUserID = req.body["id"];

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for suspension" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SERVICE COMMERCIAL") {
            throw new Error("Invalid user type");
        }

        const userToSuspend = await usersService.getUser(targetUserID);

        if (!userToSuspend) {
            throw new Error("User not found");
        }

        await usersService.suspendUser(targetUserID);

        return res.status(200).json({ message: "User suspended" });
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

const unsuspendUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Required request body is missing" });
    }

    const targetUserID = req.body["id"];

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for suspension" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const userType = decodeJWT(accessToken).type;

    try {
        if (userType != "SERVICE COMMERCIAL") {
            throw new Error("Invalid user type");
        }

        const userToSuspend = await usersService.getUser(targetUserID);

        if (!userToSuspend) {
            throw new Error("User not found");
        }

        await usersService.unsuspendUser(targetUserID);

        return res.status(200).json({ message: "User suspended" });
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

    const targetUserID = req.body["id"];

    if (!targetUserID) {
        return res.status(400).json({ error: "Missing mandatory data for edit" });
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeJWT(accessToken);
    const userID = decodedToken.id;
    const userType = decodedToken.type;

    try {
        const targetUser = await usersService.getUser(targetUserID);

        if (!targetUser) {
            throw new Error("User not found");
        }
        else if (targetUserID !== targetUser.id) {
            throw new Error("Wrong user ID in request body");
        }
        else if (targetUserID !== userID && userType !== "SERVICE COMMERCIAL") {
            throw new Error("User trying to edit another user without permission");
        }
        else if (targetUserID === userID && (userType === "SERVICE COMMERCIAL" || userType === "SERVICE TECHNIQUE")) {
            throw new Error("User trying to change their own type");
        }

        await usersService.editUser(targetUserID);

        return res.status(200).json({ message: "User deleted" });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
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
            res.status(500).json({ error: "Internal server error" });
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