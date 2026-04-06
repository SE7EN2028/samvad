import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogIn, Copy, Check, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const HomePage = () => {
    const [roomId, setRoomId] = useState("");
    const [generatedId, setGeneratedId] = useState("");
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        const id = Math.random().toString(36).substring(2, 10);
        setGeneratedId(id);
        toast.success("Room ID generated!");
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        const idToJoin = roomId.trim() || generatedId;
        if (!idToJoin) return toast.error("Please enter or generate a Room ID");
        navigate(`/room/${idToJoin}`);
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}/room/${generatedId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Real-time Collaboration
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Connect in <span className="text-primary">Rooms</span>
                    </h1>
                    <p className="text-lg text-text-muted max-w-md">
                        Create a private space, share the link, and start chatting instantly with anyone, anywhere.
                    </p>
                </div>

                <div className="glass p-8 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare size={120} />
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleCreateRoom}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                        >
                            <Plus size={24} />
                            Create New Room
                        </button>

                        {generatedId && (
                            <div className="p-4 bg-slate-800/50 border border-glass-border rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                                <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-bold">Your Room Link</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-black/20 p-2 rounded text-sm truncate">
                                        {window.location.origin}/room/{generatedId}
                                    </code>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                                <button
                                    onClick={handleJoinRoom}
                                    className="w-full mt-4 py-2 border border-primary/50 hover:bg-primary/10 text-primary font-medium rounded-lg transition-all"
                                >
                                    Enter Created Room
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-glass-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-text-muted">Or Join via ID</span>
                        </div>
                    </div>

                    <form onSubmit={handleJoinRoom} className="space-y-4">
                        <div className="relative">
                            <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-glass-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                        >
                            Join Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
