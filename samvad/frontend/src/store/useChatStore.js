import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    currentRoomId: null,
    isMessagesLoading: false,
    typingUsers: [],

    getMessages: async (roomId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${roomId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load messages");
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
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { currentRoomId } = get();
        if (!currentRoomId) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.roomId !== currentRoomId) return;
            set({ messages: [...get().messages, newMessage] });
        });

        socket.on("userTyping", ({ name, socketId }) => {
            const existing = get().typingUsers;
            if (!existing.find((u) => u.socketId === socketId)) {
                set({ typingUsers: [...existing, { name, socketId }] });
            }
        });

        socket.on("userStopTyping", ({ socketId }) => {
            set({ typingUsers: get().typingUsers.filter((u) => u.socketId !== socketId) });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.off("userTyping");
            socket.off("userStopTyping");
        }
        set({ typingUsers: [] });
    },

    setCurrentRoomId: (roomId) => set({ currentRoomId: roomId }),
}));
