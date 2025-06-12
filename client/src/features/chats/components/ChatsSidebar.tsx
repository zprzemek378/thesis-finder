import { useNavigate } from "react-router-dom";
import ChatPreview from "./ChatPreview";
import { useEffect, useState } from "react";
import { getUserChats } from "@/lib/api";
import { UserChat } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from 'lucide-react';

interface ChatsSidebarProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
  onNewChat?: () => void;
}

const ChatsSidebar = ({ onChatSelect, selectedChatId, onNewChat }: ChatsSidebarProps) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const chatsData = await getUserChats(token);
        setChats(chatsData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania czatów"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="bg-white rounded-lg shadow-md h-full text-left">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Czaty</h2>
          {userRole === 'STUDENT' && onNewChat && (
            <Button
              onClick={onNewChat}
              variant="outline"
              size="sm"
              className="bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Nowy czat
            </Button>
          )}
        </div>
      </div>

      <div>
        {isLoading && <div className="px-4 py-4">Ładowanie...</div>}
        {error && <div className="px-4 py-4 text-red-600">{error}</div>}
        {!isLoading && !error && chats.length === 0 && (
          <div className="px-4 py-4 text-gray-500">Brak czatów</div>
        )}
        {chats.map((chat) => (
          <ChatPreview
            key={chat.chatId}
            chatId={chat.chatId}
            name={chat.name}
            lastMessage={chat.lastMessage}
            onSelect={onChatSelect}
            isSelected={selectedChatId === chat.chatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatsSidebar;
