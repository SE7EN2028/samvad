import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({ message: text.trim(), image: imagePreview });
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <div className="chat-input-bar">
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
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />

                <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    type="submit"
                    className="btn-send"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
