import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogIn, Copy, Check, MessageSquare, Zap, Shield, Users } from "lucide-react";
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

                    <div className="home-features">
                        <div className="home-feature">
                            <div className="home-feature-icon">
                                <Zap size={14} />
                            </div>
                            <div className="home-feature-text">
                                <span className="home-feature-title">Instant</span>
                                <span className="home-feature-desc">Real-time messaging</span>
                            </div>
                        </div>
                        <div className="home-feature">
                            <div className="home-feature-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }}>
                                <Shield size={14} />
                            </div>
                            <div className="home-feature-text">
                                <span className="home-feature-title">Private</span>
                                <span className="home-feature-desc">Room-based access</span>
                            </div>
                        </div>
                        <div className="home-feature">
                            <div className="home-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                                <Users size={14} />
                            </div>
                            <div className="home-feature-text">
                                <span className="home-feature-title">Together</span>
                                <span className="home-feature-desc">Voice, text & media</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="home-card">
                    <MessageSquare size={140} className="card-bg-icon" />

                    <button className="btn-primary" onClick={handleCreateRoom}>
                        <Plus size={18} />
                        Create New Room
                    </button>

                    {generatedId && (
                        <div className="room-link-box">
                            <div>
                                <p className="room-link-label">Room ID</p>
                                <div className="room-link-row">
                                    <div className="room-link-text">{generatedId}</div>
                                    <button
                                        className="btn-icon"
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedId);
                                            toast.success("Room ID copied!");
                                        }}
                                        type="button"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="room-link-label">Share Link</p>
                                <div className="room-link-row">
                                    <div className="room-link-text">
                                        {window.location.origin}/room/{generatedId}
                                    </div>
                                    <button className="btn-icon" onClick={copyToClipboard} type="button">
                                        {copied
                                            ? <Check size={16} className="text-success" />
                                            : <Copy size={16} />
                                        }
                                    </button>
                                </div>
                            </div>

                            <button className="btn-ghost-primary" onClick={handleJoinRoom} type="button">
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
