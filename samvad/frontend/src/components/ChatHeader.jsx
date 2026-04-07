import { X, Hash, Users, Copy, Check } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatHeader = () => {
    const { currentRoomId } = useChatStore();
    const navigate = useNavigate();
    const [idCopied, setIdCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

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
                        Room <span style={{ opacity: 0.6, fontWeight: 400 }}>{currentRoomId}</span>
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
                    onClick={copyRoomId}
                    title="Copy room ID"
                    style={{ borderRadius: "8px", width: "auto", padding: "0 10px", gap: "6px", display: "flex", alignItems: "center", height: "32px", fontSize: "11px", fontWeight: 600 }}
                >
                    {idCopied ? <Check size={13} style={{ color: "var(--room-primary, var(--success))" }} /> : <Hash size={13} />}
                    {idCopied ? "Copied ID" : "ID"}
                </button>

                <button
                    className="btn-leave"
                    onClick={copyRoomLink}
                    title="Copy room link"
                    style={{ borderRadius: "8px", width: "auto", padding: "0 10px", gap: "6px", display: "flex", alignItems: "center", height: "32px", fontSize: "11px", fontWeight: 600 }}
                >
                    {linkCopied ? <Check size={13} style={{ color: "var(--room-primary, var(--success))" }} /> : <Copy size={13} />}
                    {linkCopied ? "Copied Link" : "Link"}
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
