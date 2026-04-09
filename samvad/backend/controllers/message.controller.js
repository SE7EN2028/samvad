import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, image, audio } = req.body;
        const { id: roomId } = req.params;
        const senderId = req.user._id;

        const newMessage = new Message({
            senderId,
            roomId,
            text: message,
            image,
            audio,
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

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized - You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(messageId);

        io.to(message.roomId).emit("messageDeleted", messageId);

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized - You can only edit your own messages" });
        }

        message.text = text;
        message.isEdited = true;
        await message.save();

        const populated = await Message.findById(messageId)
            .populate("senderId", "fullName profilePic username");

        io.to(message.roomId).emit("messageEdited", populated);

        res.status(200).json(populated);
    } catch (error) {
        console.log("Error in editMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
