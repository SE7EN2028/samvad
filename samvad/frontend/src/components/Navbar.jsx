import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, UserCircle } from "lucide-react";

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
                        <Link to="/profile" className="navbar-profile-link">
                            <img
                                src={authUser.profilePic || `https://avatar.iran.liara.run/public/boy?username=${authUser.username}`}
                                alt={authUser.fullName}
                                className="navbar-avatar"
                            />
                            <span>{authUser.fullName}</span>
                        </Link>
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
