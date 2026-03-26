import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-screen bg-transparent pt-20">
            <div className="flex items-center justify-center px-4 h-full">
                <div className="glass w-full max-w-6xl h-[calc(100vh-8rem)] flex overflow-hidden">
                    <Sidebar />
                    {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
