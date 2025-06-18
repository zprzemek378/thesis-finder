interface ChatPreviewProps {
  chatId: string;
  name: string;
  lastMessage: string;
  onSelect: (chatId: string) => void;
  isSelected?: boolean;
}

const ChatPreview = ({
  chatId,
  name,
  lastMessage,
  onSelect,
  isSelected,
}: ChatPreviewProps) => {
  return (
    <button
      onClick={() => onSelect(chatId)}
      className={`w-full text-left p-4 ${
        isSelected
          ? "bg-[var(--o-gray-light)]"
          : "hover:bg-[var(--o-gray-light)]"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium">{name}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      </div>
    </button>
  );
};

export default ChatPreview;
