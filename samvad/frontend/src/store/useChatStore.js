import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { launchActionAnimation } from "../lib/confetti";

export const useChatStore = create((set, get) => ({
    messages: [],
    currentRoomId: null,
    isMessagesLoading: false,
    typingUsers: [],
    roomUsers: [],

    getMessages: async (roomId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${roomId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { currentRoomId, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${currentRoomId}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to send message");
        }
    },

    deleteMessage: async (messageId) => {
        const { messages } = get();
        try {
            await axiosInstance.delete(`/messages/delete/${messageId}`);
            set({ messages: messages.filter((m) => m._id !== messageId) });
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to delete message");
        }
    },

    editMessage: async (messageId, text) => {
        const { messages } = get();
        try {
            const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text });
            set({
                messages: messages.map((m) => (m._id === messageId ? res.data : m)),
            });
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.response?.data?.message || "Failed to edit message");
        }
    },

    subscribeToMessages: () => {
        const { currentRoomId } = get();
        if (!currentRoomId) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.roomId !== currentRoomId) return;
            const currentMessages = get().messages;
            if (currentMessages.find((m) => m._id === newMessage._id)) return;
            set({ messages: [...currentMessages, newMessage] });
        });

        socket.on("messageDeleted", (messageId) => {
            const currentMessages = get().messages;
            set({ messages: currentMessages.filter((m) => m._id !== messageId) });
        });

        socket.on("messageEdited", (updatedMessage) => {
            const currentMessages = get().messages;
            set({
                messages: currentMessages.map((m) =>
                    m._id === updatedMessage._id ? updatedMessage : m
                ),
            });
        });

        socket.on("roomUsers", (users) => {
            set({ roomUsers: users });
        });

        socket.on("userTyping", ({ name, socketId, userId }) => {
            const myId = useAuthStore.getState().authUser?._id;
            if (userId && myId && userId === myId) return;
            const existing = get().typingUsers;
            if (!existing.find((u) => u.socketId === socketId)) {
                set({ typingUsers: [...existing, { name, socketId, userId }] });
            }
        });

        socket.on("userStopTyping", ({ socketId, userId }) => {
            const myId = useAuthStore.getState().authUser?._id;
            if (userId && myId && userId === myId) return;
            set({ typingUsers: get().typingUsers.filter((u) => u.socketId !== socketId) });
        });

        socket.on("roomAction", ({ name, action }) => {
            console.log("CELEBRATE EVENT RECEIVED FOR:", name, action);
            launchActionAnimation(action);
            const toastEl = document.createElement("div");
            toastEl.className = "celebrate-toast";
            
            const messages = {
                celebrate: `🎊 ${name} threw a party!`,
                laugh: `😂 ${name} is dying of laughter!`,
                angry: `😡 ${name} is furious!`,
                surprised: `😮 ${name} is shook!`
            };
            
            toastEl.innerText = messages[action] || `${name} sent an action`;
            document.body.appendChild(toastEl);
            setTimeout(() => toastEl.remove(), 3000);
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.off("messageDeleted");
            socket.off("messageEdited");
            socket.off("roomUsers");
            socket.off("userTyping");
            socket.off("userStopTyping");
            socket.off("roomAction");
        }
        set({ typingUsers: [], roomUsers: [] });
    },

    setCurrentRoomId: (roomId) => set({ currentRoomId: roomId }),
}));
