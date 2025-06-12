import * as Separator from "@radix-ui/react-separator";

type ChatPreviewProps = {
  message: {
    chatId: string;
    name: string;
    lastMessage: string;
    sentByMe: boolean;
  };
  onSelect: (chatId: string) => void;
  isSelected?: boolean;
};

const ChatPreview = ({ message, onSelect, isSelected }: ChatPreviewProps) => {
  return (
    <button
      className={`w-full text-left cursor-pointer ${
        isSelected
          ? "bg-[var(--o-gray-light)]"
          : "hover:bg-[var(--o-gray-light)]"
      }`}
      type="button"
      onClick={() => onSelect(message.chatId)}
    >
      <Separator.Root className="h-px bg-gray-200 mb-2" />
      <div className="px-2 font-medium">{message.name}</div>
      <div className="truncate px-2">
        {message.sentByMe && <span className="font-bold text-sm">Ty: </span>}
        <span className="font-extralight text-sm">{message.lastMessage}</span>
      </div>
      <Separator.Root className="mt-2" />
    </button>
  );
};

export default ChatPreview;
