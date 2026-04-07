import { X, Hash, Users, Copy, Check } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatHeader = () => {
    const { currentRoomId } = useChatStore();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const copyRoomLink = () => {
        const link = `${window.location.origin}/room/${currentRoomId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Room link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="chat-header"
            style={{ borderBottomColor: "var(--room-header-border, var(--glass-border))" }}
        >
            <div className="chat-header-left">
                <div
                    className="chat-header-icon"
                    style={{
                        background: "color-mix(in srgb, var(--room-primary, var(--primary)) 15%, transparent)",
                        borderColor: "color-mix(in srgb, var(--room-primary, var(--primary)) 30%, transparent)",
                        color: "var(--room-primary, var(--primary-light))",
                    }}
                >
                    <Hash size={18} />
                </div>
                <div>
                    <div className="chat-header-title">
                        Room · <span style={{ opacity: 0.6, fontWeight: 400 }}>{currentRoomId}</span>
                    </div>
                    <div
                        className="chat-header-sub"
                        style={{ color: "var(--room-primary-light, var(--primary-light))" }}
                    >
                        <span className="live-indicator" style={{ background: "var(--room-primary, var(--success))" }} />
                        <Users size={11} />
                        Live session
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                    className="btn-leave"
                    onClick={copyRoomLink}
                    title="Copy room link"
                    style={{ borderRadius: "8px", width: "auto", padding: "0 12px", gap: "6px", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 600 }}
                >
                    {copied ? <Check size={14} style={{ color: "var(--room-primary, var(--success))" }} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Share"}
                </button>

                <button
                    className="btn-leave"
                    onClick={() => navigate("/")}
                    title="Leave room"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
