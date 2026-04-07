import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatContainer from "../components/ChatContainer";

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { setCurrentRoomId } = useChatStore();
    const { socket } = useAuthStore();

    useEffect(() => {
        if (!roomId) {
            navigate("/");
            return;
        }

        setCurrentRoomId(roomId);

        if (socket) {
            socket.emit("joinRoom", roomId);
        }

        return () => {
            setCurrentRoomId(null);
        };
    }, [roomId, navigate, setCurrentRoomId, socket]);

    return (
        <div className="room-page">
            <div className="room-container">
                <div className="room-chat-wrapper">
                    <ChatContainer />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
