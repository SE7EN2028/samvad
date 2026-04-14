import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, AtSign, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
            <div className="auth-card auth-card-wide">
                <div className="auth-deco" />
                <div className="auth-deco-2" />

                <div className="auth-header">
                    <div className="auth-logo">
                        <MessageSquare size={26} />
                    </div>
                    <h1 className="auth-title">Create an account</h1>
                    <p className="auth-subtitle">Join Samvad and start chatting</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <button type="submit" className="auth-submit" disabled={isSigningUp}>
                        {isSigningUp ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                Creating account...
                            </>
                        ) : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
