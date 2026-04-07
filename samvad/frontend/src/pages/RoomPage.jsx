import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatContainer from "../components/ChatContainer";
import { getRoomVibe } from "../lib/roomVibe";

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { setCurrentRoomId } = useChatStore();
    const { socket } = useAuthStore();

    const vibe = useMemo(() => (roomId ? getRoomVibe(roomId) : {}), [roomId]);

    useEffect(() => {
        if (!roomId) {
            navigate("/");
            return;
        }
        setCurrentRoomId(roomId);
        if (socket) socket.emit("joinRoom", roomId);
        return () => setCurrentRoomId(null);
    }, [roomId, navigate, setCurrentRoomId, socket]);

    return (
        <div className="room-page" style={vibe}>
            <div
                className="room-bg-glow"
                style={{ background: vibe["--room-bg-glow"] }}
            />
            <div className="room-container">
                <div className="room-chat-wrapper" style={{ borderColor: vibe["--room-header-border"] }}>
                    <ChatContainer />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
