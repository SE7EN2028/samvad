import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare } from "lucide-react";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="navbar-logo">
                    <MessageSquare size={18} />
                </div>
                <span className="navbar-title">Samvad</span>
            </Link>

            <div className="navbar-actions">
                {authUser && (
                    <>
                        <div className="navbar-user">
                            <img
                                src={authUser.profilePic || `https://avatar.iran.liara.run/public/boy?username=${authUser.username}`}
                                alt={authUser.fullName}
                                className="navbar-avatar"
                            />
                            <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
                                {authUser.fullName}
                            </span>
                        </div>
                        <button className="btn-logout" onClick={logout}>
                            <LogOut size={14} />
                            <span>Logout</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
