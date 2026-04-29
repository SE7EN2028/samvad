import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../auth.css";

const DEMO_CREDS = { username: "demo_user", password: "demo123" };

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isDemoLogin, setIsDemoLogin] = useState(false);
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    const handleDemoLogin = () => {
        setIsDemoLogin(true);
        setShowPassword(false);
        setFormData(DEMO_CREDS);
        login(DEMO_CREDS);
    };

    const handleFieldChange = (field, value) => {
        if (isDemoLogin) setIsDemoLogin(false);
        setFormData({ ...formData, [field]: value });
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
                        Trusted by teams worldwide
                    </div>
                    <h2 className="auth-showcase-title">
                        Where conversations<br />
                        <span className="auth-showcase-accent">come alive</span>
                    </h2>
                    <p className="auth-showcase-desc">
                        Real-time messaging with rooms, voice notes, and slash commands. Built for teams that move fast.
                    </p>

                    <div className="auth-showcase-features">
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon">
                                <Zap size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Lightning Fast</div>
                                <div className="auth-showcase-feature-desc">Messages delivered in milliseconds</div>
                            </div>
                        </div>
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa' }}>
                                <Shield size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Private Rooms</div>
                                <div className="auth-showcase-feature-desc">Share access only with your team</div>
                            </div>
                        </div>
                        <div className="auth-showcase-feature">
                            <div className="auth-showcase-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
                                <Users size={16} />
                            </div>
                            <div>
                                <div className="auth-showcase-feature-title">Rich Media</div>
                                <div className="auth-showcase-feature-desc">Images, voice notes & commands</div>
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
                <div className="auth-card">
                    <div className="auth-deco" />
                    <div className="auth-deco-2" />

                    <div className="auth-header">
                        <div className="auth-logo">
                            <MessageSquare size={22} />
                        </div>
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to continue to Samvad</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label className="form-label">Username</label>
                            <div className="input-wrap">
                                <div className="input-icon"><Mail size={18} /></div>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="your_username"
                                    value={formData.username}
                                    onChange={(e) => handleFieldChange("username", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Password</label>
                            <div className="input-wrap">
                                <div className="input-icon"><Lock size={18} /></div>
                                <input
                                    type={showPassword && !isDemoLogin ? "text" : "password"}
                                    className={isDemoLogin ? "auth-input" : "auth-input has-toggle"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleFieldChange("password", e.target.value)}
                                    required
                                />
                                {!isDemoLogin && (
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 size={18} className="spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup">Create one</Link>
                        {" · "}
                        <button
                            type="button"
                            className="auth-link-btn"
                            onClick={handleDemoLogin}
                            disabled={isLoggingIn}
                        >
                            Try demo
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
