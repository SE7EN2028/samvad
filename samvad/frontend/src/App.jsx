import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Loader style={{ width: 40, height: 40, animation: 'spin 1s linear infinite', color: '#6366f1' }} />
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
            <Toaster />
        </div>
    );
};

export default App;
