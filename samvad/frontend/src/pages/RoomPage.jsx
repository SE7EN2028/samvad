import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatContainer from "../components/ChatContainer";
import { getRoomVibe } from "../lib/roomVibe";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
        if (socket) {
            socket.emit("joinRoom", roomId);
            toast.success(`Joined room: ${roomId}`, { id: "join-room" });
        }
        return () => setCurrentRoomId(null);
    }, [roomId, navigate, setCurrentRoomId, socket]);

    return (
        <motion.div
            className="room-page"
            style={vibe}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="room-bg-glow"
                style={{ background: vibe["--room-bg-glow"] }}
            />
            <div className="room-container">
                <div className="room-chat-wrapper" style={{ borderColor: vibe["--room-header-border"] }}>
                    <ChatContainer />
                </div>
            </div>
        </motion.div>
    );
};

export default RoomPage;
