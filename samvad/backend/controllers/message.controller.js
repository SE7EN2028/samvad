import Message from "../models/message.model.js";
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

        if (newMessage) {
            await newMessage.save();
        }

        io.to(roomId).emit("newMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: roomId } = req.params;

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
