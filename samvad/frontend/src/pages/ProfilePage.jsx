import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Lock, Eye, EyeOff, Camera, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [avatarPreview, setAvatarPreview] = useState(authUser?.profilePic || "");
    const [avatarBase64, setAvatarBase64] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
            setAvatarBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("Full name cannot be empty");
            return;
        }

        const payload = { fullName };
        if (avatarBase64) payload.profilePic = avatarBase64;
        if (newPassword) {
            if (!currentPassword) {
                toast.error("Enter your current password to change it");
                return;
            }
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        await updateProfile(payload);

        setCurrentPassword("");
        setNewPassword("");
        setAvatarBase64(null);
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                />

                <Link
                    to="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        marginBottom: "28px",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-main)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                    <ArrowLeft size={14} />
                    Back to Home
                </Link>

                <div className="profile-avatar-section">
                    <div className="profile-avatar-wrap">
                        <img
                            src={avatarPreview || `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`}
                            alt="Profile"
                            className="profile-avatar"
                        />
                        <button
                            type="button"
                            className="profile-avatar-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change photo"
                        >
                            <Camera size={13} />
                        </button>
                    </div>
                    <p className="profile-avatar-hint">Click the camera to change your photo</p>
                    <p className="profile-username">@{authUser?.username}</p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div>
                        <p className="profile-section-title">Account Info</p>
                        <div className="profile-field">
                            <label className="profile-label">Full Name</label>
                            <div className="profile-input-wrap">
                                <div className="profile-input-icon"><User size={16} /></div>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="profile-divider" />

                    <div>
                        <p className="profile-section-title">Change Password</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div className="profile-field">
                                <label className="profile-label">Current Password</label>
                                <div className="profile-input-wrap">
                                    <div className="profile-input-icon"><Lock size={16} /></div>
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        className="profile-input has-toggle"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="profile-field">
                                <label className="profile-label">New Password</label>
                                <div className="profile-input-wrap">
                                    <div className="profile-input-icon"><Lock size={16} /></div>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        className="profile-input has-toggle"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-profile-save" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                Saving...
                            </>
                        ) : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
