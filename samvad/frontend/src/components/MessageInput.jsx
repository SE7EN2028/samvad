import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, X, Zap, Mic, Trash2, ImagePlus, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const COMMANDS = [
    { name: "/celebrate", desc: "Rain confetti on everyone in the room", emoji: "🎊", action: "celebrate" },
    { name: "/laugh", desc: "Send laughing emojis floating globally", emoji: "😂", action: "laugh" },
    { name: "/angry", desc: "Send angry emojis floating globally", emoji: "😡", action: "angry" },
    { name: "/surprised", desc: "Send surprised emojis floating globally", emoji: "😮", action: "surprised" }
];

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showPalette, setShowPalette] = useState(false);
    const [paletteIndex, setPaletteIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimerRef = useRef(null);
    const isTypingRef = useRef(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerIntervalRef = useRef(null);
    const isCancelledRef = useRef(false);

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

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            isCancelledRef.current = false;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                if (isCancelledRef.current) return;
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    sendMessage({ message: "", audio: reader.result });
                };
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            clearTimeout(typingTimerRef.current);
            isTypingRef.current = false;
            if (socket && currentRoomId) socket.emit("stopTyping", { roomId: currentRoomId });
        } catch (err) {
            toast.error("Microphone access denied or unavailable");
        }
    };

    const sendRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerIntervalRef.current);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            isCancelledRef.current = true;
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerIntervalRef.current);
        }
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
        if (isRecording) return;
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
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const canSendText = text.trim() || imagePreview || text.startsWith("/");

    return (
        <div className="chat-input-bar">
            <AnimatePresence>
                {showPalette && filteredCommands.length > 0 && !isRecording && (
                    <motion.div
                        className="cmd-palette"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                    >
                        <div className="cmd-palette-header">
                            <Zap size={10} />
                            Commands
                        </div>
                        {filteredCommands.map((cmd, idx) => (
                            <div
                                key={cmd.name}
                                className={`cmd-item ${idx === paletteIndex ? "active" : ""}`}
                                onClick={() => executeCommand(cmd)}
                                onMouseEnter={() => setPaletteIndex(idx)}
                            >
                                <span className="cmd-emoji">{cmd.emoji}</span>
                                <div className="cmd-text">
                                    <span className="cmd-name">{cmd.name}</span>
                                    <span className="cmd-desc">{cmd.desc}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {imagePreview && !isRecording && (
                    <motion.div
                        className="img-preview-wrap"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="img-preview-thumb">
                            <img src={imagePreview} alt="Preview" />
                            <button className="img-preview-remove" onClick={removeImage} type="button">
                                <X size={10} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />

                {!isRecording && (
                    <button
                        type="button"
                        className="chat-input-action"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach image"
                    >
                        <ImagePlus size={18} />
                    </button>
                )}

                {isRecording ? (
                    <div className="recording-view">
                        <div className="recording-pulse" />
                        <span className="recording-timer">{formatTime(recordingTime)}</span>
                        <span className="recording-label">Recording...</span>
                        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                            <button type="button" className="btn-mic-cancel" onClick={cancelRecording}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input-field"
                        placeholder="Type a message or / for commands..."
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                    />
                )}

                {isRecording ? (
                    <motion.button
                        type="button"
                        className="btn-send"
                        onClick={sendRecording}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <Send size={17} />
                    </motion.button>
                ) : canSendText ? (
                    <motion.button
                        type="submit"
                        className="btn-send"
                        whileTap={{ scale: 0.92 }}
                    >
                        <Send size={17} />
                    </motion.button>
                ) : (
                    <button type="button" className="btn-mic" onClick={startRecording} title="Voice note">
                        <Mic size={18} />
                    </button>
                )}
            </form>
        </div>
    );
};

export default MessageInput;
