import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, User, Settings } from "lucide-react";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="glass fixed w-full top-0 z-40 px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-bold">Samvad</h1>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {authUser && (
                    <>
                        <button className="flex gap-2 items-center" onClick={logout}>
                            <LogOut className="size-5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
