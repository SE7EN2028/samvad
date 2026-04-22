import { X, Hash, Users, Copy, Check, Link2, LogOut } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ChatHeader = () => {
    const { currentRoomId, roomUsers } = useChatStore();
    const navigate = useNavigate();
    const [idCopied, setIdCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const copyRoomId = () => {
        navigator.clipboard.writeText(currentRoomId);
        setIdCopied(true);
        toast.success("Room ID copied!");
        setTimeout(() => setIdCopied(false), 2000);
    };

    const copyRoomLink = () => {
        const link = `${window.location.origin}/room/${currentRoomId}`;
        navigator.clipboard.writeText(link);
        setLinkCopied(true);
        toast.success("Room link copied!");
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div className="chat-header">
            <div className="chat-header-left">
                <div className="chat-header-icon">
                    <Hash size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <div className="chat-header-title">
                        Room <span className="chat-header-id">{currentRoomId}</span>
                    </div>
                    <button
                        className="chat-header-members-btn"
                        onClick={() => setShowMembers(!showMembers)}
                    >
                        <span className="live-indicator" />
                        <Users size={11} />
                        <span>{roomUsers.length} {roomUsers.length === 1 ? 'member' : 'members'}</span>
                    </button>
                </div>
            </div>

            <div className="chat-header-actions">
                <button className="chat-header-action" onClick={copyRoomId} title="Copy room ID">
                    {idCopied ? <Check size={14} className="chat-action-success" /> : <Hash size={14} />}
                    <span>{idCopied ? "Copied" : "Copy ID"}</span>
                </button>

                <button className="chat-header-action" onClick={copyRoomLink} title="Copy room link">
                    {linkCopied ? <Check size={14} className="chat-action-success" /> : <Link2 size={14} />}
                    <span>{linkCopied ? "Copied" : "Share"}</span>
                </button>

                <button
                    className="chat-header-action chat-header-leave"
                    onClick={() => navigate("/")}
                    title="Leave room"
                >
                    <LogOut size={14} />
                </button>
            </div>

            <AnimatePresence>
                {showMembers && roomUsers.length > 0 && (
                    <motion.div
                        className="chat-members-dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="chat-members-header">
                            <Users size={12} />
                            Active Members
                        </div>
                        {roomUsers.map((user, i) => (
                            <div key={user._id || i} className="chat-member-item">
                                <img
                                    src={user.profilePic || '/account.png'}
                                    alt={user.fullName}
                                    className="chat-member-avatar"
                                />
                                <span className="chat-member-name">{user.fullName}</span>
                                <span className="chat-member-dot" />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatHeader;
