import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, X, Zap } from "lucide-react";
import toast from "react-hot-toast";

const COMMANDS = [
    { name: "/celebrate", desc: "Rain confetti on everyone in the room 🎊", action: "celebrate" },
    { name: "/laugh", desc: "Send laughing emojis floating globally 😂", action: "laugh" },
    { name: "/angry", desc: "Send angry emojis floating globally 😡", action: "angry" },
    { name: "/surprised", desc: "Send surprised emojis floating globally 😮", action: "surprised" }
];

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showPalette, setShowPalette] = useState(false);
    const [paletteIndex, setPaletteIndex] = useState(0);

    const fileInputRef = useRef(null);
    const typingTimerRef = useRef(null);
    const isTypingRef = useRef(false);

    const { sendMessage, currentRoomId } = useChatStore();
    const { authUser, socket } = useAuthStore();

    const filteredCommands = text.startsWith("/") 
        ? COMMANDS.filter(c => c.name.startsWith(text.toLowerCase().split(' ')[0]))
        : [];

    useEffect(() => {
        if (text.startsWith("/") && filteredCommands.length > 0) {
            setShowPalette(true);
        } else {
            setShowPalette(false);
        }
        setPaletteIndex(0);
    }, [text]);

    const emitTyping = () => {
        if (!socket || !currentRoomId) return;
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socket.emit("typing", { roomId: currentRoomId, name: authUser?.fullName || "Someone" });
        }
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            socket.emit("stopTyping", { roomId: currentRoomId });
        }, 2000);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        emitTyping();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const executeCommand = (cmd) => {
        if (socket && currentRoomId) {
            socket.emit("roomAction", { roomId: currentRoomId, name: authUser?.fullName || "Someone", action: cmd.action });
        }
        setText("");
        setShowPalette(false);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        
        let messageText = text.trim();
        if (!messageText && !imagePreview) return;

        // Check for manual exact typed command bypass
        const matchCmd = COMMANDS.find(c => c.name === messageText);
        if (matchCmd) {
            executeCommand(matchCmd);
            return;
        }

        clearTimeout(typingTimerRef.current);
        isTypingRef.current = false;
        if (socket && currentRoomId) socket.emit("stopTyping", { roomId: currentRoomId });

        try {
            await sendMessage({ message: messageText, image: imagePreview });
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (showPalette && filteredCommands.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setPaletteIndex((prev) => (prev + 1) % filteredCommands.length);
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setPaletteIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                executeCommand(filteredCommands[paletteIndex]);
                return;
            }
            if (e.key === "Escape") {
                setShowPalette(false);
                return;
            }
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chat-input-bar" style={{ position: "relative" }}>
            {showPalette && filteredCommands.length > 0 && (
                <div className="cmd-palette">
                    <div className="cmd-palette-header">
                        <Zap size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-top' }} /> 
                        Commands
                    </div>
                    {filteredCommands.map((cmd, idx) => (
                        <div 
                            key={cmd.name}
                            className={`cmd-item ${idx === paletteIndex ? "active" : ""}`}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setPaletteIndex(idx)}
                        >
                            <span className="cmd-name">{cmd.name}</span>
                            <span className="cmd-desc">{cmd.desc}</span>
                        </div>
                    ))}
                </div>
            )}

            {imagePreview && (
                <div className="img-preview-wrap">
                    <div className="img-preview-thumb">
                        <img src={imagePreview} alt="Preview" />
                        <button className="img-preview-remove" onClick={removeImage} type="button">
                            <X size={9} />
                        </button>
                    </div>
                </div>
            )}

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />

                <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Type a message or / for commands..."
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />

                <button
                    type="submit"
                    className="btn-send"
                    disabled={!text.trim() && !imagePreview && !text.startsWith("/")}
                    style={{
                        background: "var(--room-bubble, linear-gradient(135deg, var(--primary), var(--primary-dark)))",
                        boxShadow: "0 4px 12px var(--room-bubble-shadow, rgba(99,102,241,0.3))",
                    }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
