import { Input } from "@/components/ui/input";
import * as Separator from "@radix-ui/react-separator";
import SendIcon from "./SendIcon";
import MessageBar from "./MessageBar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useRef, useState } from "react";
import { getChatMessages, sendChatMessage, Message } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface SingleChatProps {
  chatId?: string;
}

const SingleChat = ({ chatId }: SingleChatProps) => {
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let isCurrentlyFetching = false;

    const fetchMessages = async (showLoading = true) => {
      if (!chatId || isCurrentlyFetching || !isMounted) return;

      try {
        isCurrentlyFetching = true;
        if (showLoading) setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const messagesData = await getChatMessages(chatId, token);

        if (isMounted) {
          // Aktualizuj wiadomości tylko jeśli są nowe
          setMessages((prevMessages) => {
            if (
              prevMessages.length !== messagesData.length ||
              JSON.stringify(prevMessages) !== JSON.stringify(messagesData)
            ) {
              return messagesData;
            }
            return prevMessages;
          });
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Wystąpił błąd podczas pobierania wiadomości"
          );
        }
      } finally {
        isCurrentlyFetching = false;
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    };

    // Początkowe pobranie wiadomości
    fetchMessages();

    // Ustawienie interwału do pobierania nowych wiadomości
    const intervalId = setInterval(() => {
      fetchMessages(false); // Nie pokazujemy loadingu przy odświeżaniu
    }, 3000); // Co 3 sekundy

    // Czyszczenie interwału i flagi przy odmontowaniu komponentu lub zmianie chatId
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [chatId, navigate]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatId || !messageInput.trim() || isSending) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const sentMessage = await sendChatMessage(chatId, messageInput, token);
      setMessages((prev) => [...prev, { ...sentMessage, sentByMe: true }]);
      setMessageInput("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas wysyłania wiadomości"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatId) {
    return (
      <div className="md:col-span-5 flex-1 min-h-0 flex items-center justify-center text-gray-500">
        Wybierz czat aby zobaczyć wiadomości
      </div>
    );
  }

  return (
    <div className="md:col-span-5 flex-1 min-h-0">
      <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
        <div className="font-bold px-6 py-2">Czat</div>
        <Separator.Root className="h-px bg-gray-200" />

        <ScrollArea.Root className="flex-1 min-h-0">
          <ScrollArea.Viewport className="h-full w-full" ref={viewportRef}>
            <div className="p-6 gap-3 flex flex-col">
              {isLoading && <div>Ładowanie wiadomości...</div>}
              {error && <div className="text-red-600">{error}</div>}
              {!isLoading && !error && messages.length === 0 && (
                <div className="text-gray-500">Brak wiadomości</div>
              )}
              {messages.map((message) => (
                <MessageBar
                  key={message._id}
                  message={{
                    sentByMe: message.sentByMe,
                    content: message.content,
                  }}
                />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="w-2 bg-gray-200"
          >
            <ScrollArea.Thumb className="bg-gray-500 rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        <div className="flex items-center p-4">
          <Input
            placeholder="Wyślij wiadomość"
            className="rounded-full"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <button
            className="p-2 ml-2 cursor-pointer disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isSending || !messageInput.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
