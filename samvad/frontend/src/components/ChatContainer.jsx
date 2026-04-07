import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare } from "lucide-react";

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
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <ChatHeader />
                <div className="skeleton-msg">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`sk-row ${i % 2 === 0 ? 'right' : ''}`}>
                            <div className="sk-avatar" />
                            <div className="sk-bubble" style={{ width: `${30 + (i * 12)}%` }} />
                        </div>
                    ))}
                </div>
                <MessageInput />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <ChatHeader />

            <div className="chat-messages custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <div className="empty-chat-icon">
                            <MessageSquare size={24} />
                        </div>
                        <p>No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`msg-wrapper ${message.senderId === authUser._id ? "own" : "other"}`}
                        >
                            <div className={`msg-bubble ${message.senderId === authUser._id ? "own" : "other"}`}>
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="msg-image"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                                <span className="msg-time">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
