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
        toast.success("Room created");
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        const idToJoin = roomId.trim() || generatedId;
        if (!idToJoin) return toast.error("Enter or generate a Room ID");
        navigate(`/room/${idToJoin}`);
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}/room/${generatedId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="home-page">
            <div className="home-grid">
                <div>
                    <div className="home-hero-badge">
                        <span className="live-dot" />
                        Real-time Collaboration
                    </div>
                    <h1 className="home-title">
                        Connect in{" "}
                        <span className="home-title-accent">Rooms</span>
                    </h1>
                    <p className="home-subtitle">
                        Create a private space, share the link, and start chatting instantly with anyone, anywhere.
                    </p>
                </div>

                <div className="home-card">
                    <MessageSquare size={140} className="card-bg-icon" />

                    <button className="btn-primary" onClick={handleCreateRoom}>
                        <Plus size={20} />
                        Create New Room
                    </button>

                    {generatedId && (
                        <div className="room-link-box" style={{ marginTop: '14px' }}>
                            <p className="room-link-label">Your Room Link</p>
                            <div className="room-link-row">
                                <div className="room-link-text">
                                    {window.location.origin}/room/{generatedId}
                                </div>
                                <button className="btn-icon" onClick={copyToClipboard} title="Copy link">
                                    {copied
                                        ? <Check size={16} style={{ color: 'var(--success)' }} />
                                        : <Copy size={16} />
                                    }
                                </button>
                            </div>
                            <button className="btn-ghost-primary" onClick={handleJoinRoom}>
                                Enter Created Room
                            </button>
                        </div>
                    )}

                    <div className="divider">
                        <div className="divider-line" />
                        <span className="divider-text">or join via ID</span>
                        <div className="divider-line" />
                    </div>

                    <form onSubmit={handleJoinRoom}>
                        <div className="form-input-wrap">
                            <LogIn className="form-input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="home-input"
                            />
                        </div>
                        <button type="submit" className="btn-secondary">
                            Join Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
