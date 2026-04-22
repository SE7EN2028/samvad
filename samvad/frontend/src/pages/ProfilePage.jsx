import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Lock, Eye, EyeOff, Camera, Loader2, ArrowLeft, AtSign, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

    const hasChanges = fullName !== authUser?.fullName || avatarBase64 || newPassword;

    return (
        <div className="profile-page">
            <motion.div
                className="profile-container"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                />

                <div className="profile-header-section">
                    <Link to="/" className="profile-back-link">
                        <ArrowLeft size={14} />
                        Back
                    </Link>

                    <div className="profile-banner" />

                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrap">
                            <img
                                src={avatarPreview || `/account.png`}
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
                        <div className="profile-identity">
                            <h2 className="profile-display-name">{authUser?.fullName}</h2>
                            <span className="profile-username">
                                <AtSign size={12} />
                                {authUser?.username}
                            </span>
                        </div>
                    </div>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <User size={15} />
                            <span>Account Info</span>
                        </div>
                        <div className="profile-card-body">
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

                            <div className="profile-field">
                                <label className="profile-label">Username</label>
                                <div className="profile-input-wrap">
                                    <div className="profile-input-icon"><AtSign size={16} /></div>
                                    <input
                                        type="text"
                                        className="profile-input profile-input-disabled"
                                        value={authUser?.username || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-card-header">
                            <Shield size={15} />
                            <span>Security</span>
                        </div>
                        <div className="profile-card-body">
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

                    <button
                        type="submit"
                        className={`btn-profile-save ${hasChanges ? 'has-changes' : ''}`}
                        disabled={isUpdatingProfile || !hasChanges}
                    >
                        {isUpdatingProfile ? (
                            <>
                                <Loader2 size={16} className="spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
