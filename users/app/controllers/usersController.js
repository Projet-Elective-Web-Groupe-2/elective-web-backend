/**
 * Le contrôleur contenant la logique métier associée aux utilisateurs.
 * @author GAURE Warren, JOURNEL Nicolas
 * @version 1.0
*/

const usersService = require('../services/usersService');
const RESTAURANT_URL = `http://${process.env.RESTAURANT_HOST}:${process.env.RESTAURANT_PORT}/restaurant/`;

const getUser = async (req, res) => {
    let userID = req.decoded.id;
    const userType = req.decoded.type;
    const targetUserID = req.headers["userid"];

    try {
        if (userType === "TECHNICAL") {
            throw new Error("Technical trying to get user information");
        }
        else if (userType === "SALES" && (userID === targetUserID)) {
            throw new Error("Sales trying to get their own information");
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
            res.status(400).json({ error: error.message });
        }
        else if (error.message === "User not found") {
            res.status(404).json({ error: error.message });
        }
        else if (error.message === "Technical trying to get user information") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Sales trying to get their own information") {
            res.status(403).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting user : ", error);
            return res.status(500).json({ error: "Internal server error" });
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
        else {
            console.error("Unexpected error while getting user by email : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const getAllUsers = async (req, res) => {
    const userType = req.decoded.type;

    try {
        if (userType != "SALES") {
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
        else if (error.message === "Forbidden") {
            res.status(403).json({ error: "Forbidden" });
        }
        else if (error.message === "Users not found") {
            res.status(404).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while getting all users : ", error);
            return res.status(500).json({ error: "Internal server error" });
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
    const userID = req.decoded.id;
    const userType = req.decoded.type;

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
            await usersService.editUser(targetUserID, firstName, lastName, address, email, phoneNumber, encryptedPassword);
        }
        else if (userType === "RESTAURANT") {
            await usersService.editUser(targetUserID, firstName, lastName, address, email, phoneNumber, encryptedPassword);
            
            const restaurantAddress = req.body["restaurantAddress"];
            const restaurantName = req.body["restaurantName"];

            if (!restaurantAddress || !restaurantName) {
                throw new Error("Missing mandatory data for restaurant edit");
            }

            const url = `${RESTAURANT_URL}edit`;
            const response = await axios.post(url, {
                restaurantID: targetUserID,
                address: restaurantAddress,
                name: restaurantName
            },
            { 
                headers: { 
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status !== 200) {
                throw new Error("Restaurant couldn't be edited");
            }
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
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "User trying to change their own suspension status") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Missing mandatory data for restaurant edit") {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === "Restaurant couldn't be edited") {
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while editing user : ", error);
            return res.status(500).json({ error: "Internal server error" });
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

    const userType = req.decoded.type;

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
            throw new Error("User trying to suspend another sales service user");
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
        else if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.message === "Wrong user ID in request body") {
            res.status(400).json({ error: "Wrong user ID in request body" });
        }
        else if (error.message === "User trying to suspend another sales service user") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "User trying to suspend a technical service user") {
            res.status(403).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while suspending user : ", error);
            return res.status(500).json({ error: "Internal server error" });
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

    const userType = req.decoded.type;

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
            return res.status(500).json({ error: "Internal server error" });
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
    const userID = req.decoded.id;
    const userType = req.decoded.type;

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

        if (targetUser.userType === "RESTAURANT") {
            url = `${RESTAURANT_URL}findByOwner`;
            response = await axios.get(url, {
                params: { id: targetUserID },
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!response.status === 200 || !response.data) {
                throw new Error("Restaurant not found");
            }

            url = `${RESTAURANT_URL}delete`;
            response = await axios.delete(url, {
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
            res.status(404).json({ error: error.message });
        }
        else if (error.message === "Restaurant not found") {
            return res.status(200).json({ message: "User deleted" });
        }
        else if (error.message === "Wrong user ID in request body") {
            res.status(400).json({ error: error.message });
        }
        else if (error.message === "User trying to delete another user without permission") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Commercial trying to delete themselves") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Technical trying to delete themselves") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Invalid user type") {
            res.status(403).json({ error: error.message });
        }
        else if (error.message === "Restaurant couldn't be deleted") {
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("Unexpected error while editing user : ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

const metrics = async (req, res) => {
    const userType = req.decoded.type;

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
            return res.status(500).json({ error: "Internal server error" });
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