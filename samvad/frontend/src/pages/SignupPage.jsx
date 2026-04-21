import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, AtSign, Lock, Eye, EyeOff, Loader2, ArrowRight, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "../auth.css";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.username.trim()) return toast.error("Username is required");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm() === true) signup(formData);
    };

    return (
        <div className="auth-page auth-split">
            <motion.div
                className="auth-showcase"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="auth-showcase-content">
                    <div className="auth-showcase-badge">
                        <span className="live-dot" />
                        Join the conversation
                    </div>
                    <h2 className="auth-showcase-title">
                        Start chatting<br />
                        <span className="auth-showcase-accent">in seconds</span>
                    </h2>
                    <p className="auth-showcase-desc">
                        Create your account and jump into rooms instantly. No setup, no hassle — just connect.
                    </p>

                    <div className="auth-showcase-features">
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon">
                                <Zap size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Instant Setup</div>
                                <div className="auth-showcase-feature-desc">Create account in 30 seconds</div>
                            </div>
                        </div>
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa' }}>
                                <Shield size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Secure</div>
                                <div className="auth-showcase-feature-desc">Encrypted and password protected</div>
                            </div>
                        </div>
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
                                <Users size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Collaborate</div>
                                <div className="auth-showcase-feature-desc">Unlimited rooms and members</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-showcase-orbs">
                    <div className="auth-orb auth-orb-1" />
                    <div className="auth-orb auth-orb-2" />
                    <div className="auth-orb auth-orb-3" />
                </div>
            </motion.div>

            <motion.div
                className="auth-form-side"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
                <div className="auth-card auth-card-wide">
                    <div className="auth-deco" />
                    <div className="auth-deco-2" />

                    <div className="auth-header">
                        <div className="auth-logo">
                            <MessageSquare size={22} />
                        </div>
                        <h1 className="auth-title">Create an account</h1>
                        <p className="auth-subtitle">Join Samvad and start chatting</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-form-row">
                            <div className="form-field">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrap">
                                    <div className="input-icon"><User size={18} /></div>
                                    <input
                                        type="text"
                                        className="auth-input"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Username</label>
                                <div className="input-wrap">
                                    <div className="input-icon"><AtSign size={18} /></div>
                                    <input
                                        type="text"
                                        className="auth-input"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="auth-form-row">
                            <div className="form-field">
                                <label className="form-label">Password</label>
                                <div className="input-wrap">
                                    <div className="input-icon"><Lock size={18} /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="auth-input has-toggle"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-wrap">
                                    <div className="input-icon"><Lock size={18} /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 size={18} className="spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
