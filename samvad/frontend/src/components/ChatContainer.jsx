import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Pencil, Trash2, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const formatMessageTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const isSameMinute = (a, b) => {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return da.getHours() === db.getHours() && da.getMinutes() === db.getMinutes();
};

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        currentRoomId,
        subscribeToMessages,
        unsubscribeFromMessages,
        typingUsers,
        deleteMessage,
        editMessage,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

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

    const handleEditClick = (message) => {
        setEditingId(message._id);
        setEditValue(message.text || "");
    };

    const handleSaveEdit = async (messageId) => {
        if (!editValue.trim()) return;
        await editMessage(messageId, editValue);
        setEditingId(null);
    };

    const handleDeleteClick = async (messageId) => {
        if (window.confirm("Delete this message?")) {
            await deleteMessage(messageId);
        }
    };

    if (isMessagesLoading) {
        return (
            <div className="chat-layout">
                <ChatHeader />
                <div className="skeleton-msg">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`sk-row ${i % 2 === 0 ? "right" : ""}`}>
                            <div className="sk-avatar" />
                            <div className="sk-lines">
                                <div className="sk-bubble" style={{ width: `${25 + i * 10}%` }} />
                                {i % 3 === 0 && <div className="sk-bubble" style={{ width: `${15 + i * 6}%` }} />}
                            </div>
                        </div>
                    ))}
                </div>
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="chat-layout">
            <ChatHeader />

            <div className="chat-messages custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <motion.div
                            className="empty-chat-icon"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles size={26} />
                        </motion.div>
                        <p className="empty-chat-title">Start the conversation</p>
                        <p className="empty-chat-hint">Send a message or try /celebrate for some fun</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.senderId?._id === authUser._id || message.senderId === authUser._id;
                        const sender = message.senderId;
                        const senderName = sender?.fullName || "Unknown";
                        const senderPic = (sender?.profilePic && sender.profilePic.trim() !== "")
                            ? sender.profilePic
                            : "/account.png";
                        const isEditing = editingId === message._id;

                        const prevMsg = messages[index - 1];
                        const prevSameUser = prevMsg &&
                            (prevMsg.senderId?._id || prevMsg.senderId) === (message.senderId?._id || message.senderId);
                        const prevSameTime = prevMsg && isSameMinute(prevMsg.createdAt, message.createdAt);
                        const isGrouped = prevSameUser && prevSameTime;

                        return (
                            <div
                                key={message._id}
                                className={`msg-row ${isOwn ? "own" : ""} ${isGrouped ? "msg-grouped" : ""}`}
                            >
                                {!isGrouped ? (
                                    <img src={senderPic} alt={senderName} className="msg-avatar" />
                                ) : (
                                    <div className="msg-avatar-spacer" />
                                )}

                                <div className={`msg-col ${isOwn ? "own" : "other"}`}>
                                    {!isGrouped && (
                                        <div className={`msg-header ${isOwn ? "own" : "other"}`}>
                                            {!isOwn && <span className="msg-sender-name">{senderName}</span>}
                                            <span className="msg-time">
                                                {formatMessageTime(message.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`msg-bubble ${isOwn ? "own" : "other"} ${isGrouped ? "msg-bubble-grouped" : ""}`}>
                                        {message.image && (
                                            <img src={message.image} alt="Attachment" className="msg-image" />
                                        )}
                                        {message.audio && (
                                            <audio controls src={message.audio} className="msg-audio" />
                                        )}

                                        {isEditing ? (
                                            <div className="edit-container">
                                                <textarea
                                                    className="edit-textarea"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSaveEdit(message._id);
                                                        }
                                                        if (e.key === "Escape") setEditingId(null);
                                                    }}
                                                />
                                                <div className="edit-actions">
                                                    <button onClick={() => setEditingId(null)} className="btn-icon-small">
                                                        <X size={14} />
                                                    </button>
                                                    <button onClick={() => handleSaveEdit(message._id)} className="btn-icon-small primary">
                                                        <Check size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="msg-content-row">
                                                <div>
                                                    {message.text && <p>{message.text}</p>}
                                                    {message.isEdited && (
                                                        <span className="msg-edited-badge">edited</span>
                                                    )}
                                                </div>
                                                {isOwn && (
                                                    <div className="msg-hover-actions">
                                                        <button onClick={() => handleEditClick(message)} className="btn-icon-small">
                                                            <Pencil size={11} />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(message._id)} className="btn-icon-small btn-icon-danger">
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            <AnimatePresence>
                {typingUsers.length > 0 && (
                    <motion.div
                        className="typing-indicator"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="typing-dots">
                            <span /><span /><span />
                        </div>
                        <span className="typing-label">
                            {typingUsers.length === 1
                                ? `${typingUsers[0].name} is typing`
                                : `${typingUsers.map((u) => u.name).join(", ")} are typing`
                            }
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
