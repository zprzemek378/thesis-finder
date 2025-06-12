import * as Separator from "@radix-ui/react-separator";
import { Link, useNavigate } from "react-router-dom";
import ChatPreview from "./ChatPreview";
import { useEffect, useState } from "react";
import { getUserChats } from "@/lib/api";
import { UserChat } from "@/types/chat";

interface ChatsSidebarProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

const ChatsSidebar = ({ onSelectChat, selectedChatId }: ChatsSidebarProps) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="bg-white rounded-lg shadow-md h-full text-left ">
      <Link
        to="/search"
        className="p-6 flex items-center text-[var(--o-blue)] mb-6 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Wstecz
      </Link>

      <div className="font-bold px-2">Czaty</div>

      <div>
        {isLoading && <div className="px-2 py-4">Ładowanie...</div>}
        {error && <div className="px-2 py-4 text-red-600">{error}</div>}
        {!isLoading && !error && chats.length === 0 && (
          <div className="px-2 py-4 text-gray-500">Brak czatów</div>
        )}
        {chats.map((chat) => (
          <ChatPreview
            key={chat.chatId}
            message={{
              chatId: chat.chatId,
              name: chat.name,
              lastMessage: chat.lastMessage,
              sentByMe: false, // TODO: set true if last message sent by me
            }}
            onSelect={onSelectChat}
            isSelected={selectedChatId === chat.chatId}
          />
        ))}
        <Separator.Root className="h-px bg-gray-200" />
      </div>
    </div>
  );
};

export default ChatsSidebar;
