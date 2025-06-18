import React, { useEffect, useState } from "react";
import MainLayout from "@/common/layout/MainLayout";
import ChatsSidebar from "../components/ChatsSidebar";
import SingleChat from "../components/SingleChat";
import SupervisorsList from "../components/SupervisorsList";

interface User {
  _id: string;
  role: "STUDENT" | "SUPERVISOR" | "ADMIN";
}

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<string | undefined>();
  const [showSupervisors, setShowSupervisors] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowSupervisors(false); // Hide supervisors list when chat is selected
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ChatsSidebar
              selectedChatId={selectedChat}
              onChatSelect={handleChatSelect}
              onNewChat={() => setShowSupervisors(true)}
            />
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            {showSupervisors && user?.role === "STUDENT" ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[var(--o-blue)]">
                    Nowy czat
                  </h2>
                  <button
                    onClick={() => setShowSupervisors(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <SupervisorsList />
              </div>
            ) : selectedChat ? (
              <SingleChat chatId={selectedChat} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Wybierz czat z listy lub rozpocznij nową konwersację
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chats;
