import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, AtSign, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
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
        <div className="auth-page">
            <motion.div
                className="auth-card auth-card-wide"
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
                    <p className="auth-subtitle">Request Operative Access</p>
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
                                    placeholder="Arjun Sharma"
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
                                    placeholder="arjun_s"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-form-row">
                        <div className="form-field">
                            <label className="form-label">Security Key</label>
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
                            <label className="form-label">Confirm Key</label>
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
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already an operative?</span>
                    <Link to="/login" className="auth-footer-link">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
