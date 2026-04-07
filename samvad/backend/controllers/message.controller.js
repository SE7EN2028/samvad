import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: roomId } = req.params;
        const senderId = req.user._id;

        const newMessage = new Message({
            senderId,
            roomId,
            text: message,
        });

        await newMessage.save();

        const populated = await Message.findById(newMessage._id)
            .populate("senderId", "fullName profilePic username");

        io.to(roomId).emit("newMessage", populated);

        res.status(201).json(populated);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: roomId } = req.params;

        const messages = await Message.find({ roomId })
            .sort({ createdAt: 1 })
            .populate("senderId", "fullName profilePic username");

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
