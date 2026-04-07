import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic, currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (fullName) user.fullName = fullName;
        if (profilePic) user.profilePic = profilePic;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password" });
            }
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters" });
            }
            user.password = newPassword;
        }

        await user.save();

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in updateProfile: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
