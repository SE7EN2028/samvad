import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

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
        if (window.confirm("Are you sure you want to delete this message?")) {
            await deleteMessage(messageId);
        }
    };

    if (isMessagesLoading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <ChatHeader />
                <div className="skeleton-msg">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`sk-row ${i % 2 === 0 ? "right" : ""}`}>
                            <div className="sk-avatar" />
                            <div className="sk-bubble" style={{ width: `${30 + i * 12}%` }} />
                        </div>
                    ))}
                </div>
                <MessageInput />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
                    messages.map((message) => {
                        const isOwn = message.senderId?._id === authUser._id || message.senderId === authUser._id;
                        const sender = message.senderId;
                        const senderName = sender?.fullName || "Unknown";
                        const senderPic = (sender?.profilePic && sender.profilePic.trim() !== "") 
                            ? sender.profilePic 
                            : "/account.png";
                        const isEditing = editingId === message._id;

                        return (
                            <div
                                key={message._id}
                                className={`msg-row ${isOwn ? "own" : ""}`}
                            >
                                <img
                                    src={senderPic}
                                    alt={senderName}
                                    className="msg-avatar"
                                />

                                <div className={`msg-col ${isOwn ? "own" : "other"}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                                        {!isOwn && (
                                            <span className="msg-sender-name">{senderName}</span>
                                        )}
                                        {message.isEdited && (
                                            <span className="msg-edited-badge" style={{ fontSize: '10px', opacity: 0.5, fontStyle: 'italic' }}>(edited)</span>
                                        )}
                                    </div>

                                    <div
                                        className={`msg-bubble ${isOwn ? "own" : "other"}`}
                                        style={isOwn ? {
                                            background: "var(--room-bubble, linear-gradient(135deg, var(--primary), var(--primary-dark)))",
                                            boxShadow: "0 4px 16px var(--room-bubble-shadow, rgba(99,102,241,0.25))",
                                            position: 'relative',
                                        } : { position: 'relative' }}
                                    >
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Attachment"
                                                className="msg-image"
                                            />
                                        )}
                                        {message.audio && (
                                            <audio
                                                controls
                                                src={message.audio}
                                                className="msg-audio"
                                            />
                                        )}
                                        
                                        {isEditing ? (
                                            <div className="edit-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                                                <textarea
                                                    className="edit-textarea"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: '4px',
                                                        color: '#fff',
                                                        padding: '8px',
                                                        width: '100%',
                                                        resize: 'none',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => setEditingId(null)} className="btn-icon-small">
                                                        <X size={14} />
                                                    </button>
                                                    <button onClick={() => handleSaveEdit(message._id)} className="btn-icon-small primary">
                                                        <Check size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                                {message.text && <p style={{ margin: 0 }}>{message.text}</p>}
                                                {isOwn && (
                                                    <div className="msg-actions" style={{ display: 'flex', gap: '4px', opacity: 0, transition: 'opacity 0.2s' }}>
                                                        <button onClick={() => handleEditClick(message)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px', opacity: 0.7 }}>
                                                            <Pencil size={12} />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(message._id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px', opacity: 0.7 }}>
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="msg-time-outer">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            {typingUsers.length > 0 && (
                <div className="typing-indicator">
                    <div className="typing-dots">
                        <span /><span /><span />
                    </div>
                    <span className="typing-label">
                        {typingUsers.length === 1
                            ? `${typingUsers[0].name} is typing`
                            : `${typingUsers.map((u) => u.name).join(", ")} are typing`
                        }
                    </span>
                </div>
            )}

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
