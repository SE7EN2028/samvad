import { X, Hash, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
    const { currentRoomId } = useChatStore();
    const navigate = useNavigate();

    return (
        <div className="p-4 border-b border-glass-border bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <Hash size={20} />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg leading-tight tracking-tight text-white">
                            Room <span className="opacity-70 font-normal">{currentRoomId}</span>
                        </h3>
                        <p className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
                            <Users size={12} /> Live Session
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors focus:ring-2 focus:ring-primary/50 outline-none"
                    aria-label="Leave Room"
                >
                    <X className="text-text-muted hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
