import { X, Hash, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
    const { currentRoomId } = useChatStore();
    const navigate = useNavigate();

    return (
        <div className="chat-header">
            <div className="chat-header-left">
                <div className="chat-header-icon">
                    <Hash size={18} />
                </div>
                <div>
                    <div className="chat-header-title">
                        Room · <span style={{ opacity: 0.6, fontWeight: 400 }}>{currentRoomId}</span>
                    </div>
                    <div className="chat-header-sub">
                        <span className="live-indicator" />
                        <Users size={11} />
                        Live session
                    </div>
                </div>
            </div>

            <button
                className="btn-leave"
                onClick={() => navigate("/")}
                title="Leave room"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default ChatHeader;
