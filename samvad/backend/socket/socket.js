import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});



const userSocketMap = {}; 

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    const getRoomUsers = (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room) return [];
        const socketIdsInRoom = Array.from(room);
        return Object.keys(userSocketMap).filter(uId => socketIdsInRoom.includes(userSocketMap[uId]));
    };

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        
        io.to(roomId).emit("roomUsers", getRoomUsers(roomId));
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${userId} left room ${roomId}`);
        io.to(roomId).emit("roomUsers", getRoomUsers(roomId));
    });

    socket.on("typing", ({ roomId, name }) => {
        socket.to(roomId).emit("userTyping", { name, socketId: socket.id });
    });

    socket.on("stopTyping", ({ roomId }) => {
        socket.to(roomId).emit("userStopTyping", { socketId: socket.id });
    });

    socket.on("roomAction", ({ roomId, name, action }) => {
        console.log("Backend received roomAction", action, "from", name, "for room", roomId);
        io.in(roomId).emit("roomAction", { name, action });
    });

    socket.on("disconnecting", () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                const currentUsers = getRoomUsers(roomId);
                const updatedUsers = currentUsers.filter((id) => id !== userId);
                socket.to(roomId).emit("roomUsers", updatedUsers);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
