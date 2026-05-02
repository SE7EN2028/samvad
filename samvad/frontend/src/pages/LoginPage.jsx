import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../auth.css";

const DEMO_CREDS = { username: "demo_user", password: "demo123" };

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isDemoLogin, setIsDemoLogin] = useState(false);
    const [rememberLink, setRememberLink] = useState(false);
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
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="auth-deco" />
                <div className="auth-deco-2" />

                <div className="auth-header">
                    <div className="auth-brand">
                        <div className="auth-logo">
                            <MessageSquare size={26} strokeWidth={2.4} />
                        </div>
                        <h1 className="auth-wordmark">Samvad</h1>
                    </div>
                    <p className="auth-subtitle">Deep Sea Command Access</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-field">
                        <label className="form-label">Identification</label>
                        <div className="input-wrap">
                            <div className="input-icon"><Mail size={18} /></div>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="agent@deepsea.net"
                                value={formData.username}
                                onChange={(e) => handleFieldChange("username", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Security Key</label>
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

                    <div className="auth-options-row">
                        <label className="auth-checkbox">
                            <input
                                type="checkbox"
                                checked={rememberLink}
                                onChange={(e) => setRememberLink(e.target.checked)}
                            />
                            <span className="auth-checkbox-mark" />
                            <span className="auth-checkbox-label">Remember link</span>
                        </label>
                        <button type="button" className="auth-text-link">Reset Key?</button>
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
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <div className="auth-divider">
                        <span className="auth-divider-line" />
                        <span className="auth-divider-text">OR</span>
                        <span className="auth-divider-line" />
                    </div>

                    <button
                        type="button"
                        className="auth-demo-btn"
                        onClick={handleDemoLogin}
                        disabled={isLoggingIn}
                    >
                        <Zap size={16} />
                        Quick Demo Login
                    </button>
                </form>

                <div className="auth-footer">
                    <span>New operative?</span>
                    <Link to="/signup" className="auth-footer-link">Request Access</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
