import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import "../auth.css";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="auth-container">
            <div className="glass auth-card">
                <div className="bg-icon-deco">
                    <MessageSquare size={160} />
                </div>

                <div className="auth-header">
                    <div className="auth-icon-box">
                        <MessageSquare size={24} />
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <Mail size={20} />
                            </div>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="pwd-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 size={20} className="spinner" />
                                Authenticating...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="auth-link">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
