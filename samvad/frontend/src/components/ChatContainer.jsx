import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        currentRoomId,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (currentRoomId) {
            getMessages(currentRoomId);
            subscribeToMessages();
        }
        return () => unsubscribeFromMessages();
    }, [currentRoomId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto bg-slate-900/40">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto bg-slate-900/40 relative">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-2xl ${
                                message.senderId === authUser._id
                                    ? "bg-primary text-white rounded-br-none shadow-lg shadow-primary/20"
                                    : "bg-slate-800 text-text-main rounded-bl-none border border-glass-border shadow-md"
                            }`}
                        >
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                            <span className="text-[10px] opacity-50 block mt-1 text-right">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
