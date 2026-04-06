import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import "../auth.css";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-deco" />
                <div className="auth-deco-2" />

                <div className="auth-header">
                    <div className="auth-logo">
                        <MessageSquare size={26} />
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

                    <button type="submit" className="auth-submit" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                Signing in...
                            </>
                        ) : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
