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
        <div className="h-screen bg-transparent pt-20">
            <div className="flex items-center justify-center px-4 h-full">
                <div className="glass w-full max-w-6xl h-[calc(100vh-8rem)] flex overflow-hidden shadow-2xl shadow-black/50">
                    <ChatContainer />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
