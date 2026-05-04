import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader, MessageSquare } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import RoomPage from "./pages/RoomPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser)
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #15121b 100%)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'linear-gradient(135deg, #d0bcff, #5de6ff)',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'pulse-dot 1.5s ease infinite',
                        boxShadow: '0 0 32px rgba(208, 188, 255, 0.4)'
                    }}>
                        <MessageSquare size={22} color="#5516be" strokeWidth={2.4} />
                    </div>
                    <Loader style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', color: '#5de6ff' }} />
                </div>
            </div>
        );

    return (
        <div data-theme="luxury">
            <Navbar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/room/:roomId" element={authUser ? <RoomPage /> : <Navigate to="/login" />} />
                <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "rgba(21, 18, 27, 0.85)",
                        color: "#ffffff",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(28px) saturate(1.4)",
                        WebkitBackdropFilter: "blur(28px) saturate(1.4)",
                        borderRadius: "9999px",
                        padding: "10px 18px",
                        fontSize: "13px",
                        fontWeight: 500,
                        fontFamily: "Inter, system-ui, sans-serif",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
                    },
                    success: {
                        iconTheme: { primary: "#5de6ff", secondary: "#020617" },
                    },
                    error: {
                        iconTheme: { primary: "#ffb4ab", secondary: "#020617" },
                    },
                }}
            />
        </div>
    );
};

export default App;
